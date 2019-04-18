import { CallBuilder } from './call_builder';
import { BadRequestError } from './errors';
import { Asset } from 'stellar-base';
import { ServerCollectionPage, ServerTradeAggregationRecord } from './types';

const allowedResolutions = [
  60000,
  300000,
  900000,
  3600000,
  86400000,
  604800000
];

export class TradeAggregationCallBuilder extends CallBuilder<ServerCollectionPage<ServerTradeAggregationRecord>> {
  constructor(
    serverUrl: uri.URI,
    base: Asset,
    counter: Asset,
    start_time: number,
    end_time: number,
    resolution: number,
    offset: number
  ) {
    super(serverUrl);

    this.url.segment('trade_aggregations');
    if (!base.isNative()) {
      this.url.setQuery('base_asset_type', base.getAssetType());
      this.url.setQuery('base_asset_code', base.getCode());
      this.url.setQuery('base_asset_issuer', base.getIssuer());
    } else {
      this.url.setQuery('base_asset_type', 'native');
    }
    if (!counter.isNative()) {
      this.url.setQuery('counter_asset_type', counter.getAssetType());
      this.url.setQuery('counter_asset_code', counter.getCode());
      this.url.setQuery('counter_asset_issuer', counter.getIssuer());
    } else {
      this.url.setQuery('counter_asset_type', 'native');
    }
    if (typeof start_time === 'undefined' || typeof end_time === 'undefined') {
      throw new BadRequestError('Invalid time bounds', [start_time, end_time]);
    } else {
      this.url.setQuery('start_time', start_time.toString());
      this.url.setQuery('end_time', end_time.toString());
    }
    if (!this.isValidResolution(resolution)) {
      throw new BadRequestError('Invalid resolution', resolution);
    } else {
      this.url.setQuery('resolution', resolution.toString());
    }
    if (!this.isValidOffset(offset, resolution)) {
      throw new BadRequestError('Invalid offset', offset);
    } else {
      this.url.setQuery('offset', offset.toString());
    }
  }

  private isValidResolution(resolution: number): boolean {
    return allowedResolutions.includes(resolution);
  }

  private isValidOffset(offset: number, resolution: number): boolean {
    const hour = 3600000;
    return !(offset > resolution || offset >= 24 * hour || offset % hour !== 0);
  }
}
