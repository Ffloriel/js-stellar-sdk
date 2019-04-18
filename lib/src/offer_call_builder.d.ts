import { CallBuilder } from './call_builder';
import { ServerCollectionPage, ServerOfferRecord } from './types';
export declare class OfferCallBuilder extends CallBuilder<ServerCollectionPage<ServerOfferRecord>> {
    constructor(serverUrl: uri.URI, resource: string, ...resourceParams: string[]);
}
