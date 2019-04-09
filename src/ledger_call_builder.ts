import { CallBuilder } from './call_builder';

export class LedgerCallBuilder extends CallBuilder {
  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('ledgers');
  }

  ledger(sequence: number | string): LedgerCallBuilder {
    this.filter.push(['ledgers', sequence.toString()]);
    return this;
  }
}
