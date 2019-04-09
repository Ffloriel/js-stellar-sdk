import axios from 'axios';
import URI from 'urijs';

import { version } from './../package.json';
import { ServerTimeMap } from './types/index.js';

// keep a local map of server times
export const SERVER_TIME_MAP: ServerTimeMap = {};

const HorizonAxiosClient = axios.create({
  headers: {
    'X-Client-Name': 'js-stellar-sdk',
    'X-Client-Version': version
  }
});

function _toSeconds(ms: number) {
  return Math.floor(ms / 1000);
}

HorizonAxiosClient.interceptors.response.use((response) => {
  const hostname = URI(response.config.url!).hostname();
  const serverTime = _toSeconds(Date.parse(response.headers.Date));
  const localTimeRecorded = _toSeconds(new Date().getTime());

  if (!isNaN(serverTime)) {
    SERVER_TIME_MAP[hostname] = {
      serverTime,
      localTimeRecorded
    };
  }

  return response;
});

export default HorizonAxiosClient;


export function getCurrentServerTime(hostname: string) : number | null {
  const { serverTime = null, localTimeRecorded = null } = SERVER_TIME_MAP[hostname] || {};

  if (!serverTime || !localTimeRecorded) {
    return null;
  }

  const currentTime = _toSeconds(new Date().getTime());

  // if it's been more than 5 minutes from the last time, then null it out
  if (currentTime - localTimeRecorded > 60 * 5) {
    return null;
  }

  return currentTime - localTimeRecorded + serverTime;
}
