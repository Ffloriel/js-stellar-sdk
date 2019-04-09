import { CallBuilder } from './call_builder';
import { Asset } from './types/stellarBase';
export declare class OrderbookCallBuilder extends CallBuilder {
    constructor(serverUrl: uri.URI, selling: Asset, buying: Asset);
}
