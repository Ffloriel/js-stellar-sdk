import { CallBuilder } from './call_builder';
export declare class LedgerCallBuilder extends CallBuilder {
    constructor(serverUrl: uri.URI);
    ledger(sequence: number | string): LedgerCallBuilder;
}
