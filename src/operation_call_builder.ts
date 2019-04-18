import { CallBuilder } from './call_builder';
import { ServerCollectionPage, ServerOperationRecord } from './types';

export class OperationCallBuilder extends CallBuilder<ServerCollectionPage<ServerOperationRecord>> {
  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('operations');
  }

  operation(operationId: string): this {
    this.filter.push(['operations', operationId]);
    return this;
  }

  forAccount(accountId: string): this {
    this.filter.push(['accounts', accountId, 'operations']);
    return this;
  }

  forLedger(sequence: number | string): this {
    this.filter.push([
      'ledgers',
      typeof sequence === 'number' ? sequence.toString() : sequence,
      'operations'
    ]);
    return this;
  }

  forTransaction(transactionId: string): this {
    this.filter.push(['transactions', transactionId, 'operations']);
    return this;
  }

  includeFailed(value: boolean): this {
    this.url.setQuery('include_failed', value.toString());
    return this;
  }
}
