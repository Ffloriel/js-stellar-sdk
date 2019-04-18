import { ServerAccountRecord, HorizonResponseLink, HorizonAccountThresholds, HorizonFlags, HorizonBalanceLine, HorizonAccountSigner, ServerEffectRecord, ServerOfferRecord, ServerOperationRecord, ServerPaymentOperationRecord, ServerCallCollectionFunction, ServerTradeRecord } from './types';
export declare class AccountResponse implements ServerAccountRecord {
    private baseAccount;
    _links: {
        [key in 'self']: HorizonResponseLink;
    };
    id: string;
    paging_token: string;
    account_id: string;
    sequence: number;
    subentry_count: number;
    thresholds: HorizonAccountThresholds;
    flags: HorizonFlags;
    balances: HorizonBalanceLine[];
    signers: HorizonAccountSigner[];
    data: (options: {
        value: string;
    }) => Promise<{
        value: string;
    }>;
    data_attr: {
        [key: string]: string;
    };
    inflation_destination?: any;
    last_modified_ledger: number;
    effects: ServerCallCollectionFunction<ServerEffectRecord>;
    offers: ServerCallCollectionFunction<ServerOfferRecord>;
    operations: ServerCallCollectionFunction<ServerOperationRecord>;
    payments: ServerCallCollectionFunction<ServerPaymentOperationRecord>;
    trades: ServerCallCollectionFunction<ServerTradeRecord>;
    constructor(response: ServerAccountRecord);
    readonly accountId: string;
    readonly sequenceNumber: string;
    incrementSequenceNumber(): void;
}
