export declare class AccountResponse {
    private baseAccount;
    [index: string]: any;
    constructor(response: any);
    readonly accountId: string;
    readonly sequenceNumber: string;
    incrementSequenceNumber(): void;
}
