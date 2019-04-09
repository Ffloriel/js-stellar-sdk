import URI from 'urijs';
import { xdr, StrKey, Asset, Transaction } from 'stellar-base';
import BigNumber from 'bignumber.js';

import { BadResponseError } from './errors';
import { AccountCallBuilder } from './account_call_builder';
import { AccountResponse } from './account_response';
import { CallBuilder } from './call_builder';
import { Config } from './config';
import HorizonAxiosClient, {
  getCurrentServerTime
} from './horizon_axios_client';
import { LedgerCallBuilder } from './ledger_call_builder';
import { TransactionCallBuilder } from './transaction_call_builder';
import { OperationCallBuilder } from './operation_call_builder';
import { OfferCallBuilder } from './offer_call_builder';
import { OrderbookCallBuilder } from './orderbook_call_builder';
import { TradesCallBuilder } from './trades_call_builder';
import { PathCallBuilder } from './path_call_builder';
import { PaymentCallBuilder } from './payment_call_builder';
import { EffectCallBuilder } from './effect_call_builder';
import { AssetsCallBuilder } from './assets_call_builder';
import { TradeAggregationCallBuilder } from './trade_aggregation_call_builder';

import { ServerOptions, Timebounds, FeeStats } from './types/'

export const SUBMIT_TRANSACTION_TIMEOUT = 60 * 1000;

const STROOPS_IN_LUMEN = 10000000;

function _getAmountInLumens(amt: BigNumber.Value) {
  return new BigNumber(amt).div(STROOPS_IN_LUMEN).toString();
}


export class Server {

  // serverURL Horizon Server URL (ex. `https://horizon-testnet.stellar.org`).
  serverURL: uri.URI

  constructor(serverURL: string, opts: ServerOptions = {}) {
    this.serverURL = URI(serverURL);

    const allowHttp = typeof opts.allowHttp === 'undefined'
      ? Config.isAllowHttp
      : opts.allowHttp;

    if (this.serverURL.protocol() !== 'https' && !allowHttp) {
      throw new Error('Cannot connect to insecure horizon server');
    }
  }

  async fetchTimebounds(seconds: number, _isRetry: boolean = false): Promise<Timebounds> {
    // HorizonAxiosClient instead of this.ledgers so we can get at them headers
    const currentTime = getCurrentServerTime(this.serverURL.hostname());

    if (currentTime) {
      return Promise.resolve({
        minTime: 0,
        maxTime: currentTime + seconds
      });
    }

    // if this is a retry, then the retry has failed, so use local time
    if (_isRetry) {
      return Promise.resolve({
        minTime: 0,
        maxTime: Math.floor(new Date().getTime() / 1000) + seconds
      });
    }

    // otherwise, retry (by calling the root endpoint)
    // toString automatically adds the trailing slash
    await HorizonAxiosClient.get(this.serverURL.toString());
    return await this.fetchTimebounds(seconds, true);
  }

  async fetchBaseFee(): Promise<number> {
    const response = await this.ledgers()
      .order('desc')
      .limit(1)
      .call();
    if (response && response.records[0]) {
      return response.records[0].base_fee_in_stroops || 100;
    }
    return 100;
  }

  operationFeeStats(): Promise<FeeStats> {
    const cb = new CallBuilder(this.serverURL);
    cb.filter.push(['operation_fee_stats']);
    return cb.call();
  }

  async submitTransaction(transaction: Transaction): Promise<any> {
    const tx = encodeURIComponent(
      transaction
        .toEnvelope()
        .toXDR()
        .toString('base64')
    );

    try {
      const response = await HorizonAxiosClient.post(this.serverURL
        .segment('transactions')
        .toString(), `tx=${tx}`, { timeout: SUBMIT_TRANSACTION_TIMEOUT });
      if (!response.data.result_xdr) {
        return response.data;
      }
      const responseXDR = xdr.TransactionResult.fromXDR(response.data.result_xdr, 'base64');
      const results = responseXDR.result().value();
      let offerResults;
      let hasManageOffer;
      if (results.length) {
        offerResults = results.map((result: any, i: number) => {
          if (result.value().switch().name !== 'manageOffer') {
            return null;
          }
          hasManageOffer = true;
          let amountBought = new BigNumber(0);
          let amountSold = new BigNumber(0);
          const offerSuccess = result.value()
            .value()
            .success();
          const offersClaimed = offerSuccess.offersClaimed()
            .map((offerClaimed: any) => {
              const claimedOfferAmountBought = new BigNumber(
                // amountBought is a js-xdr hyper
                offerClaimed.amountBought().toString());
              const claimedOfferAmountSold = new BigNumber(
                // amountBought is a js-xdr hyper
                offerClaimed.amountSold().toString());
              // This is an offer that was filled by the one just submitted.
              // So this offer has an _opposite_ bought/sold frame of ref
              // than from what we just submitted!
              // So add this claimed offer's bought to the SOLD count and vice v
              amountBought = amountBought.plus(claimedOfferAmountSold);
              amountSold = amountSold.plus(claimedOfferAmountBought);
              const sold = Asset.fromOperation(offerClaimed.assetSold());
              const bought = Asset.fromOperation(offerClaimed.assetBought());
              const assetSold = {
                type: sold.getAssetType(),
                assetCode: sold.getCode(),
                issuer: sold.getIssuer()
              };
              const assetBought = {
                type: bought.getAssetType(),
                assetCode: bought.getCode(),
                issuer: bought.getIssuer()
              };
              return {
                sellerId: StrKey.encodeEd25519PublicKey(offerClaimed.sellerId().ed25519()),
                offerId: offerClaimed.offerId().toString(),
                assetSold,
                amountSold: _getAmountInLumens(claimedOfferAmountSold),
                assetBought,
                amountBought: _getAmountInLumens(claimedOfferAmountBought)
              };
            });
          const effect = offerSuccess.offer().switch().name;
          let currentOffer;
          if (typeof offerSuccess.offer().value === 'function' &&
            offerSuccess.offer().value()) {
            const offerXDR = offerSuccess.offer().value();
            currentOffer = {
              offerId: offerXDR.offerId().toString(),
              selling: {},
              buying: {},
              amount: _getAmountInLumens(offerXDR.amount().toString()),
              price: {
                n: offerXDR.price().n(),
                d: offerXDR.price().d()
              }
            };
            const selling = Asset.fromOperation(offerXDR.selling());
            currentOffer.selling = {
              type: selling.getAssetType(),
              assetCode: selling.getCode(),
              issuer: selling.getIssuer()
            };
            const buying = Asset.fromOperation(offerXDR.buying());
            currentOffer.buying = {
              type: buying.getAssetType(),
              assetCode: buying.getCode(),
              issuer: buying.getIssuer()
            };
          }
          return {
            offersClaimed,
            effect,
            operationIndex: i,
            currentOffer,
            // this value is in stroops so divide it out
            amountBought: _getAmountInLumens(amountBought),
            amountSold: _getAmountInLumens(amountSold),
            isFullyOpen: !offersClaimed.length && effect !== 'manageOfferDeleted',
            wasPartiallyFilled: !!offersClaimed.length && effect !== 'manageOfferDeleted',
            wasImmediatelyFilled: !!offersClaimed.length && effect === 'manageOfferDeleted',
            wasImmediatelyDeleted: !offersClaimed.length && effect === 'manageOfferDeleted'
          };
        })
          .filter((result: any) => !!result);
      }
      return Object.assign({}, response.data, {
        offerResults: hasManageOffer ? offerResults : undefined
      });
    }
    catch (response_1) {
      if (response_1 instanceof Error) {
        return Promise.reject(response_1);
      }
      return Promise.reject(new BadResponseError(`Transaction submission failed. Server responded: ${response_1.status} ${response_1.statusText}`, response_1.data));
    }
  }

  accounts(): AccountCallBuilder {
    return new AccountCallBuilder(this.serverURL);
  }

  ledgers(): LedgerCallBuilder {
    return new LedgerCallBuilder(this.serverURL);
  }

  transactions(): TransactionCallBuilder {
    return new TransactionCallBuilder(this.serverURL);
  }

  offers(resource: string, ...resourceParams: string[]): OfferCallBuilder {
    return new OfferCallBuilder(
      this.serverURL,
      resource,
      ...resourceParams
    );
  }

  orderbook(selling: Asset, buying: Asset): OrderbookCallBuilder {
    return new OrderbookCallBuilder(this.serverURL, selling, buying);
  }

  trades(): TradesCallBuilder {
    return new TradesCallBuilder(this.serverURL);
  }

  operations(): OperationCallBuilder {
    return new OperationCallBuilder(this.serverURL);
  }

  paths(source: string, destination: string, destinationAsset: Asset, destinationAmount: string): PathCallBuilder {
    return new PathCallBuilder(
      this.serverURL,
      source,
      destination,
      destinationAsset,
      destinationAmount
    );
  }

  payments(): PaymentCallBuilder {
    return new PaymentCallBuilder(this.serverURL);
  }

  effects(): EffectCallBuilder {
    return new EffectCallBuilder(this.serverURL);
  }

  assets(): AssetsCallBuilder {
    return new AssetsCallBuilder(this.serverURL);
  }

  async loadAccount(accountId: string): Promise<AccountResponse> {
    const res = await this.accounts()
      .accountId(accountId)
      .call();
    return new AccountResponse(res);
  }

  tradeAggregation(base: Asset, counter: Asset, start_time: number, end_time: number, resolution: number, offset: number): TradeAggregationCallBuilder {
    return new TradeAggregationCallBuilder(
      this.serverURL,
      base,
      counter,
      start_time,
      end_time,
      resolution,
      offset
    );
  }
}
