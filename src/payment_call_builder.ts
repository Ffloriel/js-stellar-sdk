import { CallBuilder } from './call_builder';

export class PaymentCallBuilder extends CallBuilder {

  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('payments');
  }

  forAccount(accountId: string): PaymentCallBuilder {
    this.filter.push(['accounts', accountId, 'payments']);
    return this;
  }

  forLedger(sequence: number | string): PaymentCallBuilder {
    this.filter.push([
      'ledgers',
      typeof sequence === 'number' ? sequence.toString() : sequence,
      'payments'
    ]);
    return this;
  }

  forTransaction(transactionId: string): PaymentCallBuilder {
    this.filter.push(['transactions', transactionId, 'payments']);
    return this;
  }
}
