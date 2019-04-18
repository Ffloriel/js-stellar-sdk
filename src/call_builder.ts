import URI from 'urijs';
import URITemplate from 'urijs/src/URITemplate';

import { isNode } from './utils'
import HorizonAxiosClient from './horizon_axios_client';
import { version } from './../package.json';
import { NotFoundError, NetworkError, BadRequestError } from './errors';
import { HorizonBaseResponse, ServerCollectionPage, HorizonResponseLink } from './types/index.js';
import { EventSourceOptions } from './types/eventSource.js';

interface Constructable<T> {
  new(e:string) : T;
}
declare global {
  interface Window { EventSource: Constructable<EventSource>; }
}

let EventSource: Constructable<EventSource>;

if (isNode) {
  EventSource = require('eventsource');
} else {
  EventSource = window.EventSource;
}

export class CallBuilder<T extends HorizonBaseResponse | ServerCollectionPage> {

  url: uri.URI
  filter: string[][];
  originalSegments: string[];

  constructor(serverUrl: uri.URI) {
    this.url = serverUrl;
    this.filter = [];
    this.originalSegments = this.url.segment() || [];
  }

  private checkFilter(): void {
    if (this.filter.length >= 2) {
      throw new BadRequestError('Too many filters specified', this.filter);
    }

    if (this.filter.length === 1) {
      // append filters to original segments
      const newSegment = this.originalSegments.concat(this.filter[0]);
      this.url.segment(newSegment);
    }
  }

  public async call(): Promise<T> {
    this.checkFilter();
    const r = await this._sendNormalRequest(this.url);
    return this._parseResponse(r);
  }

  public stream(options: EventSourceOptions = {}) {
    this.checkFilter();

    this.url.setQuery('X-Client-Name', 'js-stellar-sdk');
    this.url.setQuery('X-Client-Version', version);

    // EventSource object
    let es: EventSource;
    // timeout is the id of the timeout to be triggered if there were no new messages
    // in the last 15 seconds. The timeout is reset when a new message arrive.
    // It prevents closing EventSource object in case of 504 errors as `readyState`
    // property is not reliable.
    let timeout: NodeJS.Timeout;

    const createTimeout = () => {
      timeout = setTimeout(() => {
        es.close();
        es = createEventSource();
      }, options.reconnectTimeout || 15 * 1000);
    };

    const createEventSource = () => {
      try {
        es = new EventSource(this.url.toString());        
      } catch (err) {
        if (options.onerror) {
          options.onerror(err);
        }
      }

      createTimeout();

      es.onmessage = (message) => {
        const result = message.data
          ? this._parseRecord(JSON.parse(message.data))
          : message;
        if (result.paging_token) {
          this.url.setQuery('cursor', result.paging_token);
        }
        clearTimeout(timeout);
        createTimeout();
        if (typeof options.onmessage !== 'undefined') {
          options.onmessage(result);
        }
      };

      es.onerror = (error) => {
        if (options.onerror && error instanceof MessageEvent) {
          options.onerror(error);
        }
      };

      return es;
    };

    createEventSource();
    return function close() {
      clearTimeout(timeout);
      es.close();
    };
  }

  private _requestFnForLink(link: HorizonResponseLink): Function {
    return async (opts: any) => {
      let uri;

      if (link.templated) {
        const template = URITemplate(link.href);
        uri = template.expand(opts || {});
      } else {
        uri = URI(link.href);
      }

      const r = await this._sendNormalRequest(uri);
      return this._parseResponse(r);
    };
  }

  private _parseRecord(json: any): any {
    if (!json._links) {
      return json;
    }
    for (const [key, n] of Object.entries(json._links)) {
      // If the key with the link name already exists, create a copy
      if (typeof json[key] !== 'undefined') {
        json[`${key}_attr`] = json[key];
      }

      json[key] = this._requestFnForLink(n as HorizonResponseLink);
    }
    return json;
  }

  private async _sendNormalRequest(initialUrl: uri.URI) {
    let url = initialUrl;

    if (url.authority() === '') {
      url = url.authority(this.url.authority());
    }

    if (url.protocol() === '') {
      url = url.protocol(this.url.protocol());
    }

    // Temp fix for: https://github.com/stellar/js-stellar-sdk/issues/15
    url.setQuery('c', Math.random().toString());
    try {
      const response = await HorizonAxiosClient.get(url.toString());
      return response.data;
    } catch(e) {
      return Promise.reject(this._handleNetworkError(e));
    };
  }

  private _parseResponse(json: any) {
    if (json._embedded && json._embedded.records) {
      return this._toCollectionPage(json);
    }
    return this._parseRecord(json);
  }

  private _toCollectionPage(json: any) {
    for (let i = 0; i < json._embedded.records.length; i += 1) {
      json._embedded.records[i] = this._parseRecord(json._embedded.records[i]);
    }
    return {
      records: json._embedded.records,
      next: async () => {
        const r = await this._sendNormalRequest(URI(json._links.next.href));
        return this._toCollectionPage(r);
      },
      prev: async () => {
        const r = await this._sendNormalRequest(URI(json._links.prev.href));
        return this._toCollectionPage(r);
      }
    };
  }

  private _handleNetworkError(error: NetworkError): Promise<NotFoundError | NetworkError | Error> {
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 404:
          return Promise.reject(
            new NotFoundError(error.response.statusText, error.response.data)
          );
        default:
          return Promise.reject(
            new NetworkError(error.response.statusText, error.response.data)
          );
      }
    } else {
      return Promise.reject(new Error(error.message));
    }
  }

  public cursor(cursor: string): this {
    this.url.setQuery('cursor', cursor);
    return this;
  }

  public limit(recordsNumber: number): this {
    this.url.setQuery('limit', recordsNumber.toString());
    return this;
  }

  public order(direction: 'asc' | 'desc'): this {
    this.url.setQuery('order', direction);
    return this;
  }
}
