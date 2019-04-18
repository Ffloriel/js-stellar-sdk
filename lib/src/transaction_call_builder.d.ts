import { CallBuilder } from './call_builder';
import { ServerTransactionRecord } from './types';
export declare class TransactionCallBuilder extends CallBuilder<ServerTransactionRecord> {
    constructor(serverUrl: uri.URI);
    transaction(transactionId: string): this;
    forAccount(accountId: string): this;
    forLedger(sequence: number | string): this;
    includeFailed(value: boolean): this;
}
