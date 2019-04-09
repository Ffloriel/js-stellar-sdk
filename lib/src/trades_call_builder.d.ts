import { CallBuilder } from './call_builder';
import { Asset } from 'stellar-base';
export declare class TradesCallBuilder extends CallBuilder {
    constructor(serverUrl: uri.URI);
    forAssetPair(base: Asset, counter: Asset): TradesCallBuilder;
    forOffer(offerId: string): TradesCallBuilder;
    forAccount(accountId: string): TradesCallBuilder;
}
