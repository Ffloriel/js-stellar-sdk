import { CallBuilder } from './call_builder';
import { Asset } from 'stellar-base';
import { ServerCollectionPage, ServerTradeAggregationRecord } from './types';
export declare class TradeAggregationCallBuilder extends CallBuilder<ServerCollectionPage<ServerTradeAggregationRecord>> {
    constructor(serverUrl: uri.URI, base: Asset, counter: Asset, start_time: number, end_time: number, resolution: number, offset: number);
    private isValidResolution;
    private isValidOffset;
}
