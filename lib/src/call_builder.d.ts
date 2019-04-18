import { HorizonBaseResponse, ServerCollectionPage } from './types/index.js';
import { EventSourceOptions } from './types/eventSource.js';
interface Constructable<T> {
    new (e: string): T;
}
declare global {
    interface Window {
        EventSource: Constructable<EventSource>;
    }
}
export declare class CallBuilder<T extends HorizonBaseResponse | ServerCollectionPage> {
    url: uri.URI;
    filter: string[][];
    originalSegments: string[];
    constructor(serverUrl: uri.URI);
    private checkFilter;
    call(): Promise<T>;
    stream(options?: EventSourceOptions): () => void;
    private _requestFnForLink;
    private _parseRecord;
    private _sendNormalRequest;
    private _parseResponse;
    private _toCollectionPage;
    private _handleNetworkError;
    cursor(cursor: string): this;
    limit(recordsNumber: number): this;
    order(direction: 'asc' | 'desc'): this;
}
export {};
