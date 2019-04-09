import { CallBuilder } from './call_builder';
export declare class PaymentCallBuilder extends CallBuilder {
    constructor(serverUrl: uri.URI);
    forAccount(accountId: string): PaymentCallBuilder;
    forLedger(sequence: number | string): PaymentCallBuilder;
    forTransaction(transactionId: string): PaymentCallBuilder;
}
