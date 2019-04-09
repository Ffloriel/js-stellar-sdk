import { CallBuilder } from './call_builder';

export class EffectCallBuilder extends CallBuilder {
  constructor(serverUrl: uri.URI) {
    super(serverUrl);
    this.url.segment('effects');
  }

  forAccount(accountId: string): EffectCallBuilder {
    this.filter.push(['accounts', accountId, 'effects']);
    return this;
  }

  forLedger(sequence: number | string): EffectCallBuilder {
    this.filter.push([
      'ledgers',
      typeof sequence === 'number' ? sequence.toString() : sequence,
      'effects'
    ]);
    return this;
  }

  forTransaction(transactionId: string): EffectCallBuilder {
    this.filter.push(['transactions', transactionId, 'effects']);
    return this;
  }

  forOperation(operationId: string): EffectCallBuilder {
    this.filter.push(['operations', operationId, 'effects']);
    return this;
  }
}
