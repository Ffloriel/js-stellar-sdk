import { CallBuilder } from './call_builder';
import { Asset } from './types/stellarBase';
import { ServerOrderbookRecord } from './types';
export declare class OrderbookCallBuilder extends CallBuilder<ServerOrderbookRecord> {
    constructor(serverUrl: uri.URI, selling: Asset, buying: Asset);
}
