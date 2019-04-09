import { ServerTimeMap } from './types/index.js';
export declare const SERVER_TIME_MAP: ServerTimeMap;
declare const HorizonAxiosClient: import("axios").AxiosInstance;
export default HorizonAxiosClient;
export declare function getCurrentServerTime(hostname: string): number | null;
