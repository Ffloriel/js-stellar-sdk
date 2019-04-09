export declare type EventSourceOptions = {
    onmessage?: (event: MessageEvent) => void;
    onerror?: (event: MessageEvent) => void;
    reconnectTimeout?: number;
};
