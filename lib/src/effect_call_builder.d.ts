import { CallBuilder } from './call_builder';
export declare class EffectCallBuilder extends CallBuilder {
    constructor(serverUrl: uri.URI);
    forAccount(accountId: string): EffectCallBuilder;
    forLedger(sequence: number | string): EffectCallBuilder;
    forTransaction(transactionId: string): EffectCallBuilder;
    forOperation(operationId: string): EffectCallBuilder;
}
