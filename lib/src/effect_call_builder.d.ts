import { CallBuilder } from './call_builder';
import { ServerCollectionPage, ServerEffectRecord } from './types';
export declare class EffectCallBuilder extends CallBuilder<ServerCollectionPage<ServerEffectRecord>> {
    constructor(serverUrl: uri.URI);
    forAccount(accountId: string): this;
    forLedger(sequence: number | string): this;
    forTransaction(transactionId: string): this;
    forOperation(operationId: string): this;
}
