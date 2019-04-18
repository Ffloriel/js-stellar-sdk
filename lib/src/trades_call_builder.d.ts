import { CallBuilder } from './call_builder';
import { Asset } from 'stellar-base';
import { ServerCollectionPage, ServerTradeRecord } from './types';
export declare class TradesCallBuilder extends CallBuilder<ServerCollectionPage<ServerTradeRecord>> {
    constructor(serverUrl: uri.URI);
    forAssetPair(base: Asset, counter: Asset): this;
    forOffer(offerId: string): this;
    forAccount(accountId: string): this;
}
