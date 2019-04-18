import { CallBuilder } from './call_builder';
import { ServerLedgerRecord } from './types';
export declare class LedgerCallBuilder extends CallBuilder<ServerLedgerRecord> {
    constructor(serverUrl: uri.URI);
    ledger(sequence: number | string): this;
}
