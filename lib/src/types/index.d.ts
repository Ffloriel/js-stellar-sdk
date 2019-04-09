export declare type ServerOptions = {
    allowHttp?: boolean;
};
export declare type Timebounds = {
    minTime: number;
    maxTime: number;
};
export declare type Link = {
    href: string;
    templated: boolean;
};
export declare type StellarTomlResolverOptions = {
    allowHttp?: boolean;
    timeout?: number;
};
export declare type FederationServerOptions = {
    allowHttp?: boolean;
    timeout?: number;
};
export declare type FederationServerResponse = {
    account_id: string;
    memo_type?: string;
    memo?: string;
};
export declare type ServerTimeMap = {
    [index: string]: {
        serverTime: number;
        localTimeRecorded: number;
    };
};
export interface ApiJsonResponse {
    [index: string]: any;
    _links: {
        [index: string]: Link;
    };
}
export interface FeeStats extends ApiJsonResponse {
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
export interface PostTransaction extends ApiJsonResponse {
    hash: string;
    ledger: number;
    envelope_xdr: string;
    result_xdr: string;
    result_meta_xdr: string;
}
