import { Account as BaseAccount } from 'stellar-base';

/**
 * Do not create this object directly, use {@link Server#loadAccount}.
 *
 * Returns information and links relating to a single account.
 * The balances section in the returned JSON will also list all the trust lines this account has set up.
 * It also contains {@link Account} object and exposes it's methods so can be used in {@link TransactionBuilder}.
 *
 * @see [Account Details](https://www.stellar.org/developers/horizon/reference/accounts-single.html)
 * @param {string} response Response from horizon account endpoint.
 * @returns {AccountResponse} AccountResponse instance
 */
export class AccountResponse {

  private baseAccount: BaseAccount;

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
