import { CallBuilder } from './call_builder';
import { ServerAccountRecord } from './types';
export declare class AccountCallBuilder extends CallBuilder<ServerAccountRecord> {
    constructor(serverUrl: uri.URI);
    accountId(id: string): this;
}
