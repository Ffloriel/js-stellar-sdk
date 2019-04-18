import { CallBuilder } from './call_builder';
import { ServerAssetRecord, ServerCollectionPage } from './types';
export declare class AssetsCallBuilder extends CallBuilder<ServerCollectionPage<ServerAssetRecord>> {
    constructor(serverUrl: uri.URI);
    forCode(value: string): AssetsCallBuilder;
    forIssuer(value: string): AssetsCallBuilder;
}
