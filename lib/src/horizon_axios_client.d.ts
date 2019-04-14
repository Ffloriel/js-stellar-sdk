import { AxiosResponse } from 'axios';
import { ServerTime } from './types/index.js';
export declare const SERVER_TIME_MAP: Map<string, ServerTime>;
declare const HorizonAxiosClient: import("axios").AxiosInstance;
export declare function interceptorHorizonResponse(response: AxiosResponse): AxiosResponse<any>;
export default HorizonAxiosClient;
export declare function getCurrentServerTime(hostname: string): number | null;
