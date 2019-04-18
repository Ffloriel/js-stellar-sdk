import { CallBuilder } from './call_builder';
import { ServerCollectionPage, ServerOperationRecord } from './types';
export declare class OperationCallBuilder extends CallBuilder<ServerCollectionPage<ServerOperationRecord>> {
    constructor(serverUrl: uri.URI);
    operation(operationId: string): this;
    forAccount(accountId: string): this;
    forLedger(sequence: number | string): this;
    forTransaction(transactionId: string): this;
    includeFailed(value: boolean): this;
}
