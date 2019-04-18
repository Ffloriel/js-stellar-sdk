import { FederationServerOptions, FederationServerRecord } from './types';
export declare const FEDERATION_RESPONSE_MAX_SIZE: number;
export declare class FederationServer {
    serverURL: uri.URI;
    domain: string;
    timeout: number;
    constructor(serverURL: string, domain: string, opts?: FederationServerOptions);
    static resolve(value: string, opts?: FederationServerOptions): Promise<FederationServerRecord>;
    static createForDomain(domain: string, opts?: FederationServerOptions): Promise<FederationServer>;
    resolveAddress(address: string): Promise<FederationServerRecord>;
    resolveAccountId(accountId: string): Promise<FederationServerRecord>;
    resolveTransactionId(transactionId: string): Promise<FederationServerRecord>;
    _sendRequest(url: uri.URI): Promise<any>;
}
