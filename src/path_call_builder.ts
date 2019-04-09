import { CallBuilder } from './call_builder';
import { Asset } from './types/stellarBase';

export class PathCallBuilder extends CallBuilder {
  constructor(
    serverUrl: uri.URI,
    source: string,
    destination: string,
    destinationAsset: Asset,
    destinationAmount: string
  ) {
    super(serverUrl);
    this.url.segment('paths');
    this.url.setQuery('destination_account', destination);
    this.url.setQuery('source_account', source);
    this.url.setQuery('destination_amount', destinationAmount);

    if (!destinationAsset.isNative()) {
      this.url.setQuery(
        'destination_asset_type',
        destinationAsset.getAssetType()
      );
      this.url.setQuery('destination_asset_code', destinationAsset.getCode());
      this.url.setQuery(
        'destination_asset_issuer',
        destinationAsset.getIssuer()
      );
    } else {
      this.url.setQuery('destination_asset_type', 'native');
    }
  }
}
