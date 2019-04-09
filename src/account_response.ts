import { Account as BaseAccount } from 'stellar-base';

export class AccountResponse {

  private baseAccount: BaseAccount;

  [index: string]: any;

  constructor(response: any) {
    this.baseAccount = new BaseAccount(response.account_id, response.sequence);
    // Extract response fields
    for (const [key, value] of  Object.entries(response)) {
      this[key] = value;
    }
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
