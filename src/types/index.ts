export type ServerOptions = {
  // Allow connecting to http servers, default: `false`. This must be set to false in production deployments!
  allowHttp?: boolean;
}

export type Timebounds = {
  minTime: number;
  maxTime: number;
}

export type Link = {
  // The URI of the link
  href: string;
  // Whether the link is templated
  templated: boolean;
}

export type StellarTomlResolverOptions = {
  allowHttp?: boolean;
  timeout?: number;
}

export type FederationServerOptions = {
  // Allow connecting to http servers, default: `false`. This must be set to false in production deployments!
  allowHttp?: boolean;
  // Allow a timeout, default: 0. Allows user to avoid nasty lag due to TOML resolve issue. You can also use {@link Config} class to set this globally.
  timeout?: number;
}

export type FederationServerResponse = {
  // Account ID of the destination
  account_id: string;
  // Memo type that needs to be attached to a transaction
  memo_type?: string;
  // Memo value that needs to be attached to a transaction
  memo?: string;
}

export type ServerTime = {
  serverTime: number;
  localTimeRecorded: number;
}

export interface ApiJsonResponse {
  [index: string]: any;
  _links: {
    [index: string]: Link;
  }
}

export interface FeeStats extends ApiJsonResponse {
  // Last ledger sequence number
  last_ledger: number;
  // Base fee as defined in the last ledger
  last_ledger_base_fee: number;
  // Average capacity usage in the last 5 ledgers. (0 is no usage, 1.0 is completely full ledgers)
  ledger_capacity_usage: number;
  // Minimum accepted fee in the last 5 ledger.
  min_accepted_fee: number;
  // Mode accepted fee in the last 5 ledger.
  mode_accepted_fee: number; 
  // 10th percentile accepted fee in the last 5 ledger.
  p10_accepted_fee: number;
  // 20th percentile accepted fee in the last 5 ledger.
  p20_accepted_fee: number;
  // 30th percentile accepted fee in the last 5 ledger.
  p30_accepted_fee: number;
  // 40th percentile accepted fee in the last 5 ledger.
  p40_accepted_fee: number;
  // 50th percentile accepted fee in the last 5 ledger.
  p50_accepted_fee: number;
  // 60th percentile accepted fee in the last 5 ledger.
  p60_accepted_fee: number;
  // 70th percentile accepted fee in the last 5 ledger.
  p70_accepted_fee: number;
  // 80th percentile accepted fee in the last 5 ledger.
  p80_accepted_fee: number;
  // 90th percentile accepted fee in the last 5 ledger.
  p90_accepted_fee: number;
  // 95th percentile accepted fee in the last 5 ledger.
  p95_accepted_fee: number;
  // 99th percentile accepted fee in the last 5 ledger.
  p99_accepted_fee: number;
}

export interface PostTransaction extends ApiJsonResponse {
  // A hex-encoded hash of the submitted transaction.
  hash: string;
  // The ledger number that the submitted transaction was included in.
  ledger: number;
  // 	A base64 encoded TransactionEnvelope XDR object.
  envelope_xdr: string;
  // A base64 encoded TransactionResult XDR object.
  result_xdr: string;
  // 	A base64 encoded TransactionMeta XDR object.
  result_meta_xdr: string;
}
