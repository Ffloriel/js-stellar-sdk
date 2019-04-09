/// <reference types="node" />
export {};
export declare class Account {
    constructor(accountId: string, sequence: string | number);
    accountId(): string;
    sequenceNumber(): string;
    incrementSequenceNumber(): void;
}
export declare namespace AssetType {
}
export declare type AssetType = AssetType.native | AssetType.credit4 | AssetType.credit12;
export declare class Asset {
    static native(): Asset;
    static fromOperation(xdr: xdr.Asset): Asset;
    constructor(code: string, issuer: string);
    getCode(): string;
    getIssuer(): string;
    getAssetType(): AssetType;
    isNative(): boolean;
    equals(other: Asset): boolean;
    toXDRObject(): xdr.Asset;
    code: string;
    issuer: string;
}
export declare const FastSigning: boolean;
export declare type KeypairType = 'ed25519';
export declare class Keypair {
    static fromRawEd25519Seed(secretSeed: Buffer): Keypair;
    static fromBase58Seed(secretSeed: string): Keypair;
    static fromSecret(secretKey: string): Keypair;
    static master(): Keypair;
    static fromPublicKey(publicKey: string): Keypair;
    static random(): Keypair;
    constructor(keys: {
        type: KeypairType;
        secretKey: string;
        publicKey?: string;
    } | {
        type: KeypairType;
        publicKey: string;
    });
    readonly type: KeypairType;
    publicKey(): string;
    secret(): string;
    rawPublicKey(): Buffer;
    rawSecretKey(): Buffer;
    canSign(): boolean;
    sign(data: Buffer): xdr.Signature;
    signDecorated(data: Buffer): xdr.DecoratedSignature;
    signatureHint(): xdr.SignatureHint;
    verify(data: Buffer, signature: xdr.Signature): boolean;
}
export declare const MemoNone = "none";
export declare const MemoID = "id";
export declare const MemoText = "text";
export declare const MemoHash = "hash";
export declare const MemoReturn = "return";
export declare namespace MemoType {
}
export declare type MemoType = MemoType.None | MemoType.ID | MemoType.Text | MemoType.Hash | MemoType.Return;
export declare type MemoValue = null | string | Buffer;
export declare class Memo<T extends MemoType = MemoType> {
    static fromXDRObject(memo: xdr.Memo): Memo;
    static hash(hash: string): Memo<MemoType.Hash>;
    static id(id: string): Memo<MemoType.ID>;
    static none(): Memo<MemoType.None>;
    static return(hash: string): Memo<MemoType.Return>;
    static text(text: string): Memo<MemoType.Text>;
    constructor(type: MemoType.None, value?: null);
    constructor(type: MemoType.Hash | MemoType.Return, value: Buffer);
    constructor(type: MemoType.Hash | MemoType.Return | MemoType.ID | MemoType.Text, value: string);
    constructor(type: T, value: MemoValue);
    type: T;
    value: T extends MemoType.None ? null : T extends MemoType.ID ? string : T extends MemoType.Text ? string | Buffer : T extends MemoType.Hash ? Buffer : T extends MemoType.Return ? Buffer : MemoValue;
    toXDRObject(): xdr.Memo;
}
export declare enum Networks {
    PUBLIC = "Public Global Stellar Network ; September 2015",
    TESTNET = "Test SDF Network ; September 2015"
}
export declare class Network {
    static use(network: Network): void;
    static usePublicNetwork(): void;
    static useTestNetwork(): void;
    static current(): Network;
    constructor(passphrase: string);
    networkPassphrase(): string;
    networkId(): string;
}
export declare const AuthRequiredFlag: 1;
export declare const AuthRevocableFlag: 2;
export declare const AuthImmutableFlag: 4;
export declare namespace AuthFlag {
}
export declare type AuthFlag = AuthFlag.required | AuthFlag.revocable | AuthFlag.rmmutable;
export declare namespace Signer {
}
export declare type Signer = Signer.Ed25519PublicKey | Signer.Sha256Hash | Signer.PreAuthTx;
export declare namespace SignerOptions {
}
export declare type SignerOptions = SignerOptions.Ed25519PublicKey | SignerOptions.Sha256Hash | SignerOptions.PreAuthTx;
export declare namespace OperationType {
}
export declare type OperationType = OperationType.CreateAccount | OperationType.Payment | OperationType.PathPayment | OperationType.CreatePassiveOffer | OperationType.ManageOffer | OperationType.SetOptions | OperationType.ChangeTrust | OperationType.AllowTrust | OperationType.AccountMerge | OperationType.Inflation | OperationType.ManageData | OperationType.BumpSequence;
export declare namespace OperationOptions {
}
export declare type OperationOptions = OperationOptions.CreateAccount | OperationOptions.Payment | OperationOptions.PathPayment | OperationOptions.CreatePassiveOffer | OperationOptions.ManageOffer | OperationOptions.SetOptions | OperationOptions.ChangeTrust | OperationOptions.AllowTrust | OperationOptions.AccountMerge | OperationOptions.Inflation | OperationOptions.ManageData | OperationOptions.BumpSequence;
export declare namespace Operation {
}
export declare type Operation = Operation.CreateAccount | Operation.Payment | Operation.PathPayment | Operation.CreatePassiveOffer | Operation.ManageOffer | Operation.SetOptions | Operation.ChangeTrust | Operation.AllowTrust | Operation.AccountMerge | Operation.Inflation | Operation.ManageData | Operation.BumpSequence;
export declare namespace StrKey {
}
export declare class Transaction<TMemo extends Memo = Memo, TOps extends Operation[] = Operation[]> {
    constructor(envelope: string | xdr.TransactionEnvelope);
    hash(): Buffer;
    sign(...keypairs: Keypair[]): void;
    signatureBase(): Buffer;
    signHashX(preimage: Buffer | string): void;
    toEnvelope(): xdr.TransactionEnvelope;
    operations: TOps;
    sequence: number;
    fee: number;
    source: string;
    memo: TMemo;
    signatures: xdr.DecoratedSignature[];
}
export declare const TimeoutInfinite = 0;
export declare class TransactionBuilder {
    constructor(sourceAccount: Account, options?: TransactionBuilder.TransactionBuilderOptions);
    addOperation(operation: xdr.Operation): this;
    addMemo(memo: Memo): this;
    setTimeout(timeoutInSeconds: number): this;
    build(): Transaction;
}
export declare namespace TransactionBuilder {
}
declare namespace xdrHidden {
    class Operation2<T extends Operation = Operation> extends xdr.XDRStruct {
        static fromXDR(xdr: Buffer): xdr.Operation;
    }
}
export declare namespace xdr {
    export import Operation = xdrHidden.Operation2;
}
export declare function hash(data: Buffer): Buffer;
export declare function sign(data: Buffer, rawSecret: Buffer): xdr.Signature;
export declare function verify(data: Buffer, signature: xdr.Signature, rawPublicKey: Buffer): boolean;
