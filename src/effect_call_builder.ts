import { CallBuilder } from './call_builder';

export class EffectCallBuilder extends CallBuilder {
  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('effects');
  }

  public forAccount(accountId: string): EffectCallBuilder {
    this.filter.push(['accounts', accountId, 'effects']);
    return this;
  }

  public forLedger(sequence: number | string): EffectCallBuilder {
    this.filter.push([
      'ledgers',
      typeof sequence === 'number' ? sequence.toString() : sequence,
      'effects'
    ]);
    return this;
  }

  public forTransaction(transactionId: string): EffectCallBuilder {
    this.filter.push(['transactions', transactionId, 'effects']);
    return this;
  }

  public forOperation(operationId: string): EffectCallBuilder {
    this.filter.push(['operations', operationId, 'effects']);
    return this;
  }
}
