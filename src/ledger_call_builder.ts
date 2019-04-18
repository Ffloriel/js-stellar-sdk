import { CallBuilder } from './call_builder';
import { ServerLedgerRecord } from './types';

export class LedgerCallBuilder extends CallBuilder<ServerLedgerRecord> {
  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('ledgers');
  }

  public ledger(sequence: number | string): this {
    this.filter.push(['ledgers', sequence.toString()]);
    return this;
  }
}
