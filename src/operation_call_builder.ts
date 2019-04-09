import { CallBuilder } from './call_builder';

export class OperationCallBuilder extends CallBuilder {
  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('operations');
  }

  operation(operationId: string): OperationCallBuilder {
    this.filter.push(['operations', operationId]);
    return this;
  }

  forAccount(accountId: string): OperationCallBuilder {
    this.filter.push(['accounts', accountId, 'operations']);
    return this;
  }

  forLedger(sequence: number | string): OperationCallBuilder {
    this.filter.push([
      'ledgers',
      typeof sequence === 'number' ? sequence.toString() : sequence,
      'operations'
    ]);
    return this;
  }

  forTransaction(transactionId: string): OperationCallBuilder {
    this.filter.push(['transactions', transactionId, 'operations']);
    return this;
  }

  includeFailed(value: boolean): OperationCallBuilder {
    this.url.setQuery('include_failed', value.toString());
    return this;
  }
}
