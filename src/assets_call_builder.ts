import { CallBuilder } from './call_builder';

export class AssetsCallBuilder extends CallBuilder {
  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('assets');
  }

  public forCode(value: string): AssetsCallBuilder {
    this.url.setQuery('asset_code', value);
    return this;
  }

  public forIssuer(value: string): AssetsCallBuilder {
    this.url.setQuery('asset_issuer', value);
    return this;
  }
}
