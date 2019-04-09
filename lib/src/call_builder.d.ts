import { EventSourceOptions } from './types/eventSource.js';
interface Constructable<T> {
    new (e: string): T;
}
declare global {
    interface Window {
        EventSource: Constructable<EventSource>;
    }
}
export declare class CallBuilder {
    url: uri.URI;
    filter: string[][];
    originalSegments: string[];
    constructor(serverUrl: uri.URI);
    private checkFilter;
    /**
     * Triggers a HTTP request using this builder's current configuration.
     * @returns {Promise} a Promise that resolves to the server's response.
     */
    call(): Promise<any>;
    stream(options?: EventSourceOptions): () => void;
    private _requestFnForLink;
    private _parseRecord;
    private _sendNormalRequest;
    private _parseResponse;
    private _toCollectionPage;
    private _handleNetworkError;
    cursor(cursor: string): CallBuilder;
    limit(recordsNumber: number): CallBuilder;
    order(direction: 'asc' | 'desc'): CallBuilder;
}
export {};
