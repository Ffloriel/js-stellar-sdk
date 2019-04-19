/// <reference types="node" />
import { AssetType, Asset, MemoType } from 'stellar-base';
export { Account, Asset, AssetType, AuthFlag, AuthImmutableFlag, AuthRequiredFlag, AuthRevocableFlag, FastSigning, Keypair, Memo, MemoType, MemoValue, MemoHash, MemoID, MemoNone, MemoReturn, MemoText, Network, Networks, Operation, OperationOptions, OperationType, StrKey, Signer, SignerOptions, Transaction, TransactionBuilder, hash, sign, verify, xdr } from 'stellar-base';
export {};
declare type Key = string | number | symbol;
declare type Diff<T extends Key, U extends Key> = ({
    [P in T]: P;
} & {
    [P in U]: never;
} & {
    [x: string]: never;
})[T];
declare type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
export interface Timebounds {
    minTime: number;
    maxTime: number;
}
export interface HorizonResponseLink {
    href: string;
    templated?: boolean;
}
export interface HorizonBaseResponse<T extends string = never> {
    _links: {
        [key in T | 'self']: HorizonResponseLink;
    };
}
export interface HorizonTransactionResponse extends HorizonBaseResponse<'account' | 'ledger' | 'operations' | 'effects' | 'succeeds' | 'precedes'> {
    created_at: string;
    envelope_xdr: string;
    fee_meta_xdr: string;
    fee_paid: number;
    hash: string;
    id: string;
    ledger: number;
    memo_type: MemoType;
    memo?: string;
    operation_count: number;
    paging_token: string;
    result_meta_xdr: string;
    result_xdr: string;
    signatures: string[];
    source_account: string;
    source_account_sequence: string;
}
export interface HorizonFeeStatsResponse extends HorizonBaseResponse {
    [index: string]: any;
    last_ledger: number;
    last_ledger_base_fee: number;
    ledger_capacity_usage: number;
    min_accepted_fee: number;
    mode_accepted_fee: number;
    p10_accepted_fee: number;
    p20_accepted_fee: number;
    p30_accepted_fee: number;
    p40_accepted_fee: number;
    p50_accepted_fee: number;
    p60_accepted_fee: number;
    p70_accepted_fee: number;
    p80_accepted_fee: number;
    p90_accepted_fee: number;
    p95_accepted_fee: number;
    p99_accepted_fee: number;
}
export interface HorizonBalanceLineNative {
    balance: string;
    asset_type: AssetType.native;
    buying_liabilities: string;
    selling_liabilities: string;
}
export interface HorizonBalanceLineAsset<T extends AssetType.credit4 | AssetType.credit12 = AssetType.credit4 | AssetType.credit12> {
    balance: string;
    limit: string;
    asset_type: T;
    asset_code: string;
    asset_issuer: string;
    buying_liabilities: string;
    selling_liabilities: string;
    last_modified_ledger: number;
}
export declare type HorizonBalanceLine<T extends AssetType = AssetType> = T extends AssetType.native ? HorizonBalanceLineNative : T extends AssetType.credit4 | AssetType.credit12 ? HorizonBalanceLineAsset<T> : HorizonBalanceLineNative | HorizonBalanceLineAsset;
export interface HorizonPriceR {
    numerator: number;
    denominator: number;
}
export interface HorizonPriceRShorthand {
    n: number;
    d: number;
}
export interface HorizonAccountThresholds {
    low_threshold: number;
    med_threshold: number;
    high_threshold: number;
}
export interface HorizonFlags {
    auth_required: boolean;
    auth_revocable: boolean;
}
export interface HorizonAccountSigner {
    public_key: string;
    weight: number;
}
export interface HorizonAccountResponse extends HorizonBaseResponse<'transactions' | 'operations' | 'payments' | 'effects' | 'offers' | 'trades' | 'data'> {
    id: string;
    paging_token: string;
    account_id: string;
    sequence: string;
    subentry_count: number;
    thresholds: HorizonAccountThresholds;
    flags: HorizonFlags;
    balances: HorizonBalanceLine[];
    signers: HorizonAccountSigner[];
    data: {
        [key: string]: string;
    };
}
declare enum HorizonOperationResponseType {
    createAccount = "create_account",
    payment = "payment",
    pathPayment = "path_payment",
    createPassiveOffer = "create_passive_offer",
    manageOffer = "manage_offer",
    setOptions = "set_options",
    changeTrust = "change_trust",
    allowTrust = "allow_trust",
    accountMerge = "account_merge",
    inflation = "inflation",
    manageData = "manage_data",
    bumpSequence = "bump_sequence"
}
declare enum HorizonOperationResponseTypeI {
    createAccount = 0,
    payment = 1,
    pathPayment = 2,
    createPassiveOffer = 3,
    manageOffer = 4,
    setOptions = 5,
    changeTrust = 6,
    allowTrust = 7,
    accountMerge = 8,
    inflation = 9,
    manageData = 10,
    bumpSequence = 11
}
interface HorizonBaseOperationResponse<T extends HorizonOperationResponseType = HorizonOperationResponseType, TI extends HorizonOperationResponseTypeI = HorizonOperationResponseTypeI> extends HorizonBaseResponse<'succeeds' | 'precedes' | 'effects' | 'transaction'> {
    id: string;
    paging_token: string;
    source_account: string;
    type: T;
    type_i: TI;
    created_at: string;
    transaction_hash: string;
}
interface HorizonCreateAccountOperationResponse extends HorizonBaseOperationResponse<HorizonOperationResponseType.createAccount, HorizonOperationResponseTypeI.createAccount> {
    account: string;
    funder: string;
    starting_balance: string;
}
interface HorizonPaymentOperationResponse extends HorizonBaseOperationResponse<HorizonOperationResponseType.payment, HorizonOperationResponseTypeI.payment> {
    from: string;
    to: string;
    asset_type: AssetType;
    asset_code?: string;
    asset_issuer?: string;
    amount: string;
}
interface HorizonPathPaymentOperationResponse extends HorizonBaseOperationResponse<HorizonOperationResponseType.pathPayment, HorizonOperationResponseTypeI.pathPayment> {
    from: string;
    to: string;
    asset_type: AssetType;
    asset_code?: string;
    asset_issuer?: string;
    amount: string;
    source_asset_type: AssetType;
    source_asset_code?: string;
    source_asset_issuer?: string;
    source_max: string;
    source_amount: string;
}
interface HorizonManageOfferOperationResponse extends HorizonBaseOperationResponse<HorizonOperationResponseType.manageOffer, HorizonOperationResponseTypeI.manageOffer> {
    offer_id: number;
    amount: string;
    buying_asset_type: AssetType;
    buying_asset_code?: string;
    buying_asset_issuer?: string;
    price: string;
    price_r: HorizonPriceR;
    selling_asset_type: AssetType;
    selling_asset_code?: string;
    selling_asset_issuer?: string;
}
interface HorizonPassiveOfferOperationResponse extends HorizonBaseOperationResponse<HorizonOperationResponseType.createPassiveOffer, HorizonOperationResponseTypeI.createPassiveOffer> {
    offer_id: number;
    amount: string;
    buying_asset_type: AssetType;
    buying_asset_code?: string;
    buying_asset_issuer?: string;
    price: string;
    price_r: HorizonPriceR;
    selling_asset_type: AssetType;
    selling_asset_code?: string;
    selling_asset_issuer?: string;
}
interface HorizonSetOptionsOperationResponse extends HorizonBaseOperationResponse<HorizonOperationResponseType.setOptions, HorizonOperationResponseTypeI.setOptions> {
    signer_key?: string;
    signer_weight?: number;
    master_key_weight?: number;
    low_threshold?: number;
    med_threshold?: number;
    high_threshold?: number;
    home_domain?: string;
    set_flags: Array<1 | 2>;
    set_flags_s: Array<'auth_required_flag' | 'auth_revocable_flag'>;
    clear_flags: Array<1 | 2>;
    clear_flags_s: Array<'auth_required_flag' | 'auth_revocable_flag'>;
}
interface HorizonChangeTrustOperationResponse extends HorizonBaseOperationResponse<HorizonOperationResponseType.changeTrust, HorizonOperationResponseTypeI.changeTrust> {
    asset_type: AssetType.credit4 | AssetType.credit12;
    asset_code: string;
    asset_issuer: string;
    trustee: string;
    trustor: string;
    limit: string;
}
interface HorizonAllowTrustOperationResponse extends HorizonBaseOperationResponse<HorizonOperationResponseType.allowTrust, HorizonOperationResponseTypeI.allowTrust> {
    asset_type: AssetType;
    asset_code: string;
    asset_issuer: string;
    authorize: boolean;
    trustee: string;
    trustor: string;
}
interface HorizonAccountMergeOperationResponse extends HorizonBaseOperationResponse<HorizonOperationResponseType.accountMerge, HorizonOperationResponseTypeI.accountMerge> {
    into: string;
}
interface HorizonInflationOperationResponse extends HorizonBaseOperationResponse<HorizonOperationResponseType.inflation, HorizonOperationResponseTypeI.inflation> {
}
interface HorizonManageDataOperationResponse extends HorizonBaseOperationResponse<HorizonOperationResponseType.manageData, HorizonOperationResponseTypeI.manageData> {
    name: string;
    value: Buffer;
}
interface HorizonBumpSequenceOperationResponse extends HorizonBaseOperationResponse<HorizonOperationResponseType.bumpSequence, HorizonOperationResponseTypeI.bumpSequence> {
    bump_to: string;
}
export interface HorizonResponseCollection<T extends HorizonBaseResponse = HorizonBaseResponse> {
    _links: {
        self: HorizonResponseLink;
        next: HorizonResponseLink;
        prev: HorizonResponseLink;
    };
    _embedded: {
        records: T[];
    };
}
export interface HorizonTransactionResponseCollection extends HorizonResponseCollection<HorizonTransactionResponse> {
}
export interface ServerCollectionPage<T extends HorizonBaseResponse = HorizonBaseResponse> {
    records: T[];
    next: () => Promise<ServerCollectionPage<T>>;
    prev: () => Promise<ServerCollectionPage<T>>;
}
export interface ServerCollectionRecord<T extends HorizonBaseResponse = HorizonBaseResponse> {
    _links: {
        next: HorizonResponseLink;
        prev: HorizonResponseLink;
        self: HorizonResponseLink;
    };
    _embedded: {
        records: T[];
    };
}
export interface ServerCallFunctionTemplateOptions {
    cursor?: string | number;
    limit?: number;
    order?: 'asc' | 'desc';
}
export declare type ServerCallFunction<T extends HorizonBaseResponse = HorizonBaseResponse> = () => Promise<T>;
export declare type ServerCallCollectionFunction<T extends HorizonBaseResponse = HorizonBaseResponse> = (options?: ServerCallFunctionTemplateOptions) => Promise<ServerCollectionRecord<T>>;
export interface ServerAccountRecord extends HorizonBaseResponse {
    id: string;
    paging_token: string;
    account_id: string;
    sequence: number;
    subentry_count: number;
    inflation_destination?: string;
    last_modified_ledger: number;
    thresholds: HorizonAccountThresholds;
    flags: HorizonFlags;
    balances: HorizonBalanceLine[];
    signers: Array<{
        public_key: string;
        weight: number;
    }>;
    data: (options: {
        value: string;
    }) => Promise<{
        value: string;
    }>;
    data_attr: {
        [key: string]: string;
    };
    effects: ServerCallCollectionFunction<ServerEffectRecord>;
    offers: ServerCallCollectionFunction<ServerOfferRecord>;
    operations: ServerCallCollectionFunction<ServerOperationRecord>;
    payments: ServerCallCollectionFunction<ServerPaymentOperationRecord>;
    trades: ServerCallCollectionFunction<ServerTradeRecord>;
}
export interface ServerAssetRecord extends HorizonBaseResponse {
    asset_type: AssetType.credit4 | AssetType.credit12;
    asset_code: string;
    asset_issuer: string;
    paging_token: string;
    amount: string;
    num_accounts: number;
    flags: HorizonFlags;
}
export interface ServerEffectRecord extends HorizonBaseResponse {
    account: string;
    paging_token: string;
    starting_balance: string;
    type_i: string;
    type: string;
    amount?: any;
    operation?: ServerCallFunction<ServerOperationRecord>;
    precedes?: ServerCallFunction<ServerEffectRecord>;
    succeeds?: ServerCallFunction<ServerEffectRecord>;
}
export interface ServerLedgerRecord extends HorizonBaseResponse {
    id: string;
    paging_token: string;
    hash: string;
    prev_hash: string;
    sequence: number;
    transaction_count: number;
    operation_count: number;
    closed_at: string;
    total_coins: string;
    fee_pool: string;
    base_fee: number;
    base_reserve: string;
    max_tx_set_size: number;
    protocol_version: number;
    header_xdr: string;
    base_fee_in_stroops: number;
    base_reserve_in_stroops: number;
    records?: Array<ServerLedgerRecord>;
    effects: ServerCallCollectionFunction<ServerEffectRecord>;
    operations: ServerCallCollectionFunction<ServerOperationRecord>;
    self: ServerCallFunction<ServerLedgerRecord>;
    transactions: ServerCallCollectionFunction<ServerTransactionRecord>;
}
export interface ServerOfferAsset {
    asset_type: AssetType;
    asset_code?: string;
    asset_issuer?: string;
}
export interface ServerOfferRecord extends HorizonBaseResponse {
    id: string;
    paging_token: string;
    seller: string;
    selling: ServerOfferAsset;
    buying: ServerOfferAsset;
    amount: string;
    price_r: HorizonPriceRShorthand;
    price: string;
    last_modified_ledger: number;
    last_modified_time: string;
}
export interface ServerBaseOperationRecord<T extends HorizonOperationResponseType = HorizonOperationResponseType, TI extends HorizonOperationResponseTypeI = HorizonOperationResponseTypeI> extends HorizonBaseOperationResponse<T, TI> {
    self: ServerCallFunction<ServerOperationRecord>;
    succeeds: ServerCallFunction<ServerOperationRecord>;
    precedes: ServerCallFunction<ServerOperationRecord>;
    effects: ServerCallCollectionFunction<ServerEffectRecord>;
    transaction: ServerCallFunction<ServerTransactionRecord>;
}
export interface ServerCreateAccountOperationRecord extends ServerBaseOperationRecord<HorizonOperationResponseType.createAccount, HorizonOperationResponseTypeI.createAccount>, HorizonCreateAccountOperationResponse {
}
export interface ServerPaymentOperationRecord extends ServerBaseOperationRecord<HorizonOperationResponseType.payment, HorizonOperationResponseTypeI.payment>, HorizonPaymentOperationResponse {
    sender: ServerCallFunction<ServerAccountRecord>;
    receiver: ServerCallFunction<ServerAccountRecord>;
}
export interface ServerPathPaymentOperationRecord extends ServerBaseOperationRecord<HorizonOperationResponseType.pathPayment, HorizonOperationResponseTypeI.pathPayment>, HorizonPathPaymentOperationResponse {
}
export interface ServerManageOfferOperationRecord extends ServerBaseOperationRecord<HorizonOperationResponseType.manageOffer, HorizonOperationResponseTypeI.manageOffer>, HorizonManageOfferOperationResponse {
}
export interface ServerPassiveOfferOperationRecord extends ServerBaseOperationRecord<HorizonOperationResponseType.createPassiveOffer, HorizonOperationResponseTypeI.createPassiveOffer>, HorizonPassiveOfferOperationResponse {
}
export interface ServerSetOptionsOperationRecord extends ServerBaseOperationRecord<HorizonOperationResponseType.setOptions, HorizonOperationResponseTypeI.setOptions>, HorizonSetOptionsOperationResponse {
}
export interface ServerChangeTrustOperationRecord extends ServerBaseOperationRecord<HorizonOperationResponseType.changeTrust, HorizonOperationResponseTypeI.changeTrust>, HorizonChangeTrustOperationResponse {
}
export interface ServerAllowTrustOperationRecord extends ServerBaseOperationRecord<HorizonOperationResponseType.allowTrust, HorizonOperationResponseTypeI.allowTrust>, HorizonAllowTrustOperationResponse {
}
export interface ServerAccountMergeOperationRecord extends ServerBaseOperationRecord<HorizonOperationResponseType.accountMerge, HorizonOperationResponseTypeI.accountMerge>, HorizonAccountMergeOperationResponse {
}
export interface ServerInflationOperationRecord extends ServerBaseOperationRecord<HorizonOperationResponseType.inflation, HorizonOperationResponseTypeI.inflation>, HorizonInflationOperationResponse {
}
export interface ServerManageDataOperationRecord extends ServerBaseOperationRecord<HorizonOperationResponseType.manageData, HorizonOperationResponseTypeI.manageData>, HorizonManageDataOperationResponse {
}
interface ServerBumpSequenceOperationRecord extends ServerBaseOperationRecord<HorizonOperationResponseType.bumpSequence, HorizonOperationResponseTypeI.bumpSequence>, HorizonBumpSequenceOperationResponse {
}
export declare type ServerOperationRecord = ServerCreateAccountOperationRecord | ServerPaymentOperationRecord | ServerPathPaymentOperationRecord | ServerManageOfferOperationRecord | ServerPassiveOfferOperationRecord | ServerSetOptionsOperationRecord | ServerChangeTrustOperationRecord | ServerAllowTrustOperationRecord | ServerAccountMergeOperationRecord | ServerInflationOperationRecord | ServerManageDataOperationRecord | ServerBumpSequenceOperationRecord;
export interface ServerOrderbookRecord extends HorizonBaseResponse {
    bids: Array<{
        price_r: {};
        price: number;
        amount: string;
    }>;
    asks: Array<{
        price_r: {};
        price: number;
        amount: string;
    }>;
    selling: Asset;
    buying: Asset;
}
export interface ServerPaymentPathRecord extends HorizonBaseResponse {
    path: Array<{
        asset_code: string;
        asset_issuer: string;
        asset_type: string;
    }>;
    source_amount: string;
    source_asset_type: string;
    source_asset_code: string;
    source_asset_issuer: string;
    destination_amount: string;
    destination_asset_type: string;
    destination_asset_code: string;
    destination_asset_issuer: string;
}
export interface ServerTradeRecord extends HorizonBaseResponse {
    id: string;
    paging_token: string;
    ledger_close_time: string;
    offer_id: string;
    base_offer_id: string;
    base_account: string;
    base_amount: string;
    base_asset_type: string;
    base_asset_code?: string;
    base_asset_issuer?: string;
    counter_offer_id: string;
    counter_account: string;
    counter_amount: string;
    counter_asset_type: string;
    counter_asset_code?: string;
    counter_asset_issuer?: string;
    base_is_seller: boolean;
    base: ServerCallFunction<ServerAccountRecord>;
    counter: ServerCallFunction<ServerAccountRecord>;
    operation: ServerCallFunction<ServerOperationRecord>;
}
export interface ServerTradeAggregationRecord extends HorizonBaseResponse {
    timestamp: string;
    trade_count: number;
    base_volume: string;
    counter_volume: string;
    avg: string;
    high: string;
    low: string;
    open: string;
    close: string;
}
export interface CurrentOffer {
    offerId: string;
    selling: {
        type: AssetType;
        assetCode: string;
        issuer?: string;
    };
    buying: {
        type: AssetType;
        assetCode: string;
        issuer?: string;
    };
    amount: string;
    price: HorizonPriceRShorthand;
}
export interface OfferResult {
    offersClaimed: any[];
    effect: string;
    operationIndex: number;
    currentOffer?: CurrentOffer;
    amountBought: string;
    amountSold: string;
    wasPartiallyFilled: boolean;
    wasImmediatelyFilled: boolean;
    wasImmediatelyDeleted: boolean;
    isFullyOpen?: boolean;
}
export interface ServerTransactionRecord extends Omit<HorizonTransactionResponse, 'ledger'> {
    ledger_attr: HorizonTransactionResponse['ledger'];
    offerResults?: OfferResult[];
    account: ServerCallFunction<ServerAccountRecord>;
    effects: ServerCallCollectionFunction<ServerEffectRecord>;
    ledger: ServerCallFunction<ServerLedgerRecord>;
    operations: ServerCallCollectionFunction<ServerOperationRecord>;
    precedes: ServerCallFunction<ServerTransactionRecord>;
    self: ServerCallFunction<ServerTransactionRecord>;
    succeeds: ServerCallFunction<ServerTransactionRecord>;
}
export interface ServerOptions {
    allowHttp?: boolean;
}
export declare type ServerTime = {
    serverTime: number;
    localTimeRecorded: number;
};
export interface StellarTomlResolverOptions {
    allowHttp?: boolean;
    timeout?: number;
}
export interface FederationServerOptions {
    allowHttp?: boolean;
    timeout?: number;
}
export interface FederationServerRecord {
    account_id: string;
    memo_type?: string;
    memo?: string;
}
