import { CallBuilder } from './call_builder';
import { ServerCollectionPage, ServerEffectRecord } from './types';

export class EffectCallBuilder extends CallBuilder<ServerCollectionPage<ServerEffectRecord>> {
  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('effects');
  }

  public forAccount(accountId: string): this {
    this.filter.push(['accounts', accountId, 'effects']);
    return this;
  }

  public forLedger(sequence: number | string): this {
    this.filter.push([
      'ledgers',
      typeof sequence === 'number' ? sequence.toString() : sequence,
      'effects'
    ]);
    return this;
  }

  public forTransaction(transactionId: string): this {
    this.filter.push(['transactions', transactionId, 'effects']);
    return this;
  }

  public forOperation(operationId: string): this {
    this.filter.push(['operations', operationId, 'effects']);
    return this;
  }
}
