import { CallBuilder } from './call_builder';
export declare class TransactionCallBuilder extends CallBuilder {
    constructor(serverUrl: uri.URI);
    transaction(transactionId: string): TransactionCallBuilder;
    forAccount(accountId: string): TransactionCallBuilder;
    forLedger(sequence: number | string): TransactionCallBuilder;
    includeFailed(value: boolean): TransactionCallBuilder;
}
