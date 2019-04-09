import { CallBuilder } from './call_builder';
export declare class AccountCallBuilder extends CallBuilder {
    constructor(serverUrl: uri.URI);
    accountId(id: string): AccountCallBuilder;
}
