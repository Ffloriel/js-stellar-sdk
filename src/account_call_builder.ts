import { CallBuilder } from './call_builder';

export class AccountCallBuilder extends CallBuilder {
  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('accounts');
  }

  public accountId(id: string): AccountCallBuilder {
    this.filter.push(['accounts', id]);
    return this;
  }
}
