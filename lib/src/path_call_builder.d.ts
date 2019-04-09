import { CallBuilder } from './call_builder';
import { Asset } from './types/stellarBase';
export declare class PathCallBuilder extends CallBuilder {
    constructor(serverUrl: uri.URI, source: string, destination: string, destinationAsset: Asset, destinationAmount: string);
}
