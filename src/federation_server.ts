import axios from 'axios';
import URI from 'urijs';
import { StrKey } from 'stellar-base';

import { Config } from './config';
import { BadResponseError } from './errors';
import { StellarTomlResolver } from './stellar_toml_resolver';
import { FederationServerOptions } from './types';

// FEDERATION_RESPONSE_MAX_SIZE is the maximum size of response from a federation server
export const FEDERATION_RESPONSE_MAX_SIZE = 100 * 1024;

export class FederationServer {

  // The federation server URL (ex. `https://acme.com/federation`).
  serverURL: uri.URI;
  // Domain this server represents.
  domain: string;
  // Allow a timeout, default: 0. Allows user to avoid nasty lag due to TOML resolve issue.
  timeout: number;

  constructor(serverURL: string, domain: string, opts: FederationServerOptions = {}) {
    // TODO `domain` regexp
    this.serverURL = URI(serverURL);
    this.domain = domain;

    const allowHttp = typeof opts.allowHttp === 'undefined'
      ? Config.isAllowHttp()
      : opts.allowHttp;

    this.timeout = typeof opts.timeout === 'undefined'
      ? Config.getTimeout()
      : opts.timeout;

    if (this.serverURL.protocol() !== 'https' && !allowHttp) {
      throw new Error('Cannot connect to insecure federation server');
    }
  }

  static async resolve(value: string, opts: FederationServerOptions = {}) {
    // Check if `value` is in account ID format
    if (value.indexOf('*') < 0) {
      if (!StrKey.isValidEd25519PublicKey(value)) {
        return Promise.reject(new Error('Invalid Account ID'));
      }
      return Promise.resolve({ account_id: value });
    }

    const addressParts = value.split('*');
    const [, domain] = addressParts;

    if (addressParts.length !== 2 || !domain) {
      return Promise.reject(new Error('Invalid Stellar address'));
    }
    const federationServer = await FederationServer.createForDomain(domain, opts);
    return federationServer.resolveAddress(value);
  }

  static async createForDomain(domain: string, opts: FederationServerOptions = {}): Promise<FederationServer> {
    const tomlObject = await StellarTomlResolver.resolve(domain, opts);
    if (!tomlObject.FEDERATION_SERVER) {
      return Promise.reject(new Error('stellar.toml does not contain FEDERATION_SERVER field'));
    }
    return new FederationServer(tomlObject.FEDERATION_SERVER, domain, opts);
  }

  resolveAddress(address: string): Promise<any> {
    let stellarAddress = address;
    if (address.indexOf('*') < 0) {
      if (!this.domain) {
        return Promise.reject(
          new Error(
            'Unknown domain. Make sure `address` contains a domain (ex. `bob*stellar.org`) or pass `domain` parameter when instantiating the server object.'
          )
        );
      }
      stellarAddress = `${address}*${this.domain}`;
    }
    const url = this.serverURL.query({ type: 'name', q: stellarAddress });
    return this._sendRequest(url);
  }

  resolveAccountId(accountId: string): Promise<any> {
    const url = this.serverURL.query({ type: 'id', q: accountId });
    return this._sendRequest(url);
  }

  resolveTransactionId(transactionId: string): Promise<any> {
    const url = this.serverURL.query({ type: 'txid', q: transactionId });
    return this._sendRequest(url);
  }

  async _sendRequest(url: uri.URI) {
    const timeout = this.timeout;

    try {
      const response = await axios
        .get(url.toString(), {
          maxContentLength: FEDERATION_RESPONSE_MAX_SIZE,
          timeout
        });
      if (typeof response.data.memo !== 'undefined' &&
        typeof response.data.memo !== 'string') {
        throw new Error('memo value should be of type string');
      }
      return response.data;
    }
    catch (response_1) {
      if (response_1 instanceof Error) {
        if (response_1.message.match(/^maxContentLength size/)) {
          throw new Error(`federation response exceeds allowed size of ${FEDERATION_RESPONSE_MAX_SIZE}`);
        }
        else {
          return Promise.reject(response_1);
        }
      }
      else {
        return Promise.reject(new BadResponseError(`Server query failed. Server responded: ${response_1.status} ${response_1.statusText}`, response_1.data));
      }
    }
  }
}
