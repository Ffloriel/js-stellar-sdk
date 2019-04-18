import { CallBuilder } from './call_builder';
import { ServerPaymentOperationRecord } from './types';
export declare class PaymentCallBuilder extends CallBuilder<ServerPaymentOperationRecord> {
    constructor(serverUrl: uri.URI);
    forAccount(accountId: string): this;
    forLedger(sequence: number | string): this;
    forTransaction(transactionId: string): this;
}
