import { Account as BaseAccount } from 'stellar-base';
import { ServerAccountRecord, HorizonResponseLink, HorizonAccountThresholds, HorizonFlags, HorizonBalanceLine, HorizonAccountSigner, ServerEffectRecord, ServerOfferRecord, ServerOperationRecord, ServerPaymentOperationRecord, ServerCallCollectionFunction, ServerTradeRecord, ServerTransactionRecord } from './types';

export class AccountResponse implements ServerAccountRecord{

  private baseAccount: BaseAccount;

  _links!: {
    [key in 'self']: HorizonResponseLink;
  };
  id!: string;
  paging_token!: string;
  account_id!: string;
  sequence!: number;
  subentry_count!: number;
  thresholds!: HorizonAccountThresholds;
  flags!: HorizonFlags;
  balances!: HorizonBalanceLine[];
  signers!: HorizonAccountSigner[];
  data!: (options: {
    value: string;
  }) => Promise<{
    value: string;
  }>;
  data_attr!: {
    [key: string]: string;
  };
  inflation_destination?: any;
  last_modified_ledger!: number;

  effects!: ServerCallCollectionFunction<ServerEffectRecord>;
  offers!: ServerCallCollectionFunction<ServerOfferRecord>;
  operations!: ServerCallCollectionFunction<ServerOperationRecord>;
  payments!: ServerCallCollectionFunction<ServerPaymentOperationRecord>;
  trades!: ServerCallCollectionFunction<ServerTradeRecord>;
  transactions!: ServerCallCollectionFunction<ServerTransactionRecord>;

  constructor(response: ServerAccountRecord) {
    this.baseAccount = new BaseAccount(response.account_id, response.sequence);
    // Extract response fields
    Object.assign(this, response);
    // for (const [key, value] of  Object.entries(response)) {
    //   this[key] = value;
    // }
  }

  get accountId(): string {
    return this.baseAccount.accountId();
  }

  get sequenceNumber(): string {
    return this.baseAccount.sequenceNumber();
  }

  public incrementSequenceNumber(): void {
    this.baseAccount.incrementSequenceNumber();
  }
}
