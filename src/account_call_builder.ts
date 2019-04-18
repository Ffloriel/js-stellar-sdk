import { CallBuilder } from './call_builder';
import { ServerAccountRecord } from './types';

export class AccountCallBuilder extends CallBuilder<ServerAccountRecord> {
  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('accounts');
  }

  public accountId(id: string): this {
    this.filter.push(['accounts', id]);
    return this;
  }
}
