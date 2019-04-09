import { CallBuilder } from './call_builder';
import { Asset } from './types/stellarBase';

export class OrderbookCallBuilder extends CallBuilder {
  constructor(serverUrl: uri.URI, selling: Asset, buying: Asset) {
    super(serverUrl);
    this.url.segment('order_book');
    if (!selling.isNative()) {
      this.url.setQuery('selling_asset_type', selling.getAssetType());
      this.url.setQuery('selling_asset_code', selling.getCode());
      this.url.setQuery('selling_asset_issuer', selling.getIssuer());
    } else {
      this.url.setQuery('selling_asset_type', 'native');
    }
    if (!buying.isNative()) {
      this.url.setQuery('buying_asset_type', buying.getAssetType());
      this.url.setQuery('buying_asset_code', buying.getCode());
      this.url.setQuery('buying_asset_issuer', buying.getIssuer());
    } else {
      this.url.setQuery('buying_asset_type', 'native');
    }
  }
}
