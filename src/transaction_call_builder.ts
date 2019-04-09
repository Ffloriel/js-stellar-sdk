import { CallBuilder } from './call_builder';

export class TransactionCallBuilder extends CallBuilder {
  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('transactions');
  }

  transaction(transactionId: string): TransactionCallBuilder {
    this.filter.push(['transactions', transactionId]);
    return this;
  }

  forAccount(accountId: string): TransactionCallBuilder {
    this.filter.push(['accounts', accountId, 'transactions']);
    return this;
  }

  forLedger(sequence: number | string): TransactionCallBuilder {
    const ledgerSequence =
      typeof sequence === 'number' ? sequence.toString() : sequence;

    this.filter.push(['ledgers', ledgerSequence, 'transactions']);
    return this;
  }

  includeFailed(value: boolean): TransactionCallBuilder {
    this.url.setQuery('include_failed', value.toString());
    return this;
  }
}
