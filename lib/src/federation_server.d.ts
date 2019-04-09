import { FederationServerOptions } from './types';
export declare const FEDERATION_RESPONSE_MAX_SIZE: number;
export declare class FederationServer {
    serverURL: uri.URI;
    domain: string;
    timeout: number;
    constructor(serverURL: string, domain: string, opts?: FederationServerOptions);
    static resolve(value: string, opts?: FederationServerOptions): Promise<any>;
    static createForDomain(domain: string, opts?: FederationServerOptions): Promise<FederationServer>;
    resolveAddress(address: string): Promise<any>;
    resolveAccountId(accountId: string): Promise<any>;
    resolveTransactionId(transactionId: string): Promise<any>;
    _sendRequest(url: uri.URI): Promise<any>;
}
