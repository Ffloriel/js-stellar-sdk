import { CallBuilder } from './call_builder';
import { ServerPaymentOperationRecord } from './types';

export class PaymentCallBuilder extends CallBuilder<ServerPaymentOperationRecord> {

  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('payments');
  }

  public forAccount(accountId: string): this {
    this.filter.push(['accounts', accountId, 'payments']);
    return this;
  }

  public forLedger(sequence: number | string): this {
    this.filter.push([
      'ledgers',
      typeof sequence === 'number' ? sequence.toString() : sequence,
      'payments'
    ]);
    return this;
  }

  public forTransaction(transactionId: string): this {
    this.filter.push(['transactions', transactionId, 'payments']);
    return this;
  }
}
