import { CallBuilder } from './call_builder';
import { Asset } from './types/stellarBase';
import { ServerCollectionPage, ServerPaymentPathRecord } from './types';
export declare class PathCallBuilder extends CallBuilder<ServerCollectionPage<ServerPaymentPathRecord>> {
    constructor(serverUrl: uri.URI, source: string, destination: string, destinationAsset: Asset, destinationAmount: string);
}
