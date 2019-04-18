import { CallBuilder } from './call_builder';
import { BadRequestError } from './errors';
import { ServerCollectionPage, ServerOfferRecord } from './types';

export class OfferCallBuilder extends CallBuilder<ServerCollectionPage<ServerOfferRecord>> {
  constructor(serverUrl: uri.URI, resource: string, ...resourceParams: string[]) {
    super(serverUrl);
    if (resource === 'accounts') {
      this.url.segment([resource, ...resourceParams, 'offers']);
    } else {
      throw new BadRequestError('Bad resource specified for offer:', resource);
    }
  }
}
