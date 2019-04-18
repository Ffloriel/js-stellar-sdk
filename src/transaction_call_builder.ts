import { CallBuilder } from './call_builder';
import { ServerTransactionRecord } from './types';

export class TransactionCallBuilder extends CallBuilder<ServerTransactionRecord> {
  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('transactions');
  }

  public transaction(transactionId: string): this {
    this.filter.push(['transactions', transactionId]);
    return this;
  }

  public forAccount(accountId: string): this {
    this.filter.push(['accounts', accountId, 'transactions']);
    return this;
  }

  public forLedger(sequence: number | string): this {
    const ledgerSequence =
      typeof sequence === 'number' ? sequence.toString() : sequence;

    this.filter.push(['ledgers', ledgerSequence, 'transactions']);
    return this;
  }

  public includeFailed(value: boolean): this {
    this.url.setQuery('include_failed', value.toString());
    return this;
  }
}
