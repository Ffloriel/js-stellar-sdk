export declare class NetworkError extends Error {
    response: any;
    constructor(message: string, response: any);
    getResponse(): any;
}
export declare class NotFoundError extends NetworkError {
}
export declare class BadRequestError extends NetworkError {
}
export declare class BadResponseError extends NetworkError {
}
