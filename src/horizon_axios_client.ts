import axios, { AxiosResponse } from 'axios';
import URI from 'urijs';

import { version } from './../package.json';
import { ServerTime } from './types/index.js';

// keep a local map of server times
export const SERVER_TIME_MAP: Map<string, ServerTime> = new Map();

const HorizonAxiosClient = axios.create({
  headers: {
    'X-Client-Name': 'js-stellar-sdk',
    'X-Client-Version': version
  }
});

function _toSeconds(ms: number): number {
  return Math.floor(ms / 1000);
}

export function interceptorHorizonResponse(response: AxiosResponse) {
  const hostname = URI(response.config.url!).hostname();
  const serverTime = _toSeconds(Date.parse(response.headers.Date));
  const localTimeRecorded = _toSeconds(new Date().getTime());

  if (!isNaN(serverTime)) {
    SERVER_TIME_MAP.set(hostname, {
      serverTime,
      localTimeRecorded
    });
  }
  return response;
}

HorizonAxiosClient.interceptors.response.use(interceptorHorizonResponse);

export default HorizonAxiosClient;

export function getCurrentServerTime(hostname: string) : number | null {
  if (!SERVER_TIME_MAP.has(hostname)) {
    return null;
  }
  const { serverTime, localTimeRecorded } = SERVER_TIME_MAP.get(hostname)!;
  const currentTime = _toSeconds(new Date().getTime());

  // if it's been more than 5 minutes from the last time, then null it out
  if (currentTime - localTimeRecorded > 60 * 5) {
    return null;
  }
  return currentTime - localTimeRecorded + serverTime;
}
