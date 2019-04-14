import { CallBuilder } from './call_builder';
import { Asset } from 'stellar-base';

export class TradesCallBuilder extends CallBuilder {
  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('trades');
  }

  public forAssetPair(base: Asset, counter: Asset): TradesCallBuilder {
    if (!base.isNative()) {
      this.url.setQuery('base_asset_type', base.getAssetType());
      this.url.setQuery('base_asset_code', base.getCode());
      this.url.setQuery('base_asset_issuer', base.getIssuer());
    } else {
      this.url.setQuery('base_asset_type', 'native');
    }
    if (!counter.isNative()) {
      this.url.setQuery('counter_asset_type', counter.getAssetType());
      this.url.setQuery('counter_asset_code', counter.getCode());
      this.url.setQuery('counter_asset_issuer', counter.getIssuer());
    } else {
      this.url.setQuery('counter_asset_type', 'native');
    }
    return this;
  }

  public forOffer(offerId: string): TradesCallBuilder {
    this.url.setQuery('offer_id', offerId);
    return this;
  }

  public forAccount(accountId: string): TradesCallBuilder {
    this.filter.push(['accounts', accountId, 'trades']);
    return this;
  }
}
