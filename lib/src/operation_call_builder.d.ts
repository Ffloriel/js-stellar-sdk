import { CallBuilder } from './call_builder';
export declare class OperationCallBuilder extends CallBuilder {
    constructor(serverUrl: uri.URI);
    operation(operationId: string): OperationCallBuilder;
    forAccount(accountId: string): OperationCallBuilder;
    forLedger(sequence: number | string): OperationCallBuilder;
    forTransaction(transactionId: string): OperationCallBuilder;
    includeFailed(value: boolean): OperationCallBuilder;
}
