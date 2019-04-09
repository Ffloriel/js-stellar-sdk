import { CallBuilder } from './call_builder';
import { Asset } from 'stellar-base';
export declare class TradeAggregationCallBuilder extends CallBuilder {
    constructor(serverUrl: uri.URI, base: Asset, counter: Asset, start_time: number, end_time: number, resolution: number, offset: number);
    private isValidResolution;
    private isValidOffset;
}
