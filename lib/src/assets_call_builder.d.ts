import { CallBuilder } from './call_builder';
export declare class AssetsCallBuilder extends CallBuilder {
    constructor(serverUrl: uri.URI);
    forCode(value: string): AssetsCallBuilder;
    forIssuer(value: string): AssetsCallBuilder;
}
