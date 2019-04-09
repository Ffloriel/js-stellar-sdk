import axios from 'axios';
import toml from 'toml';
import { Config } from './config';
import { StellarTomlResolverOptions } from '@/types/'

// STELLAR_TOML_MAX_SIZE is the maximum size of stellar.toml file
export const STELLAR_TOML_MAX_SIZE = 100 * 1024;

/**
 * StellarTomlResolver allows resolving `stellar.toml` files.
 */
export class StellarTomlResolver {

  static async resolve(domain: string, opts: StellarTomlResolverOptions = {}): Promise<any> {
    const allowHttp = typeof opts.allowHttp === 'undefined'
      ? Config.isAllowHttp()
      : opts.allowHttp;

    const timeout = typeof opts.timeout === 'undefined'
      ? Config.getTimeout()
      : opts.timeout;
    
    const protocol = allowHttp ? 'http' : 'https';

    try {
      const response = await axios
        .get(`${protocol}://${domain}/.well-known/stellar.toml`, {
          maxContentLength: STELLAR_TOML_MAX_SIZE,
          timeout
        });
      try {
        const tomlObject = toml.parse(response.data);
        return Promise.resolve(tomlObject);
      }
      catch (e) {
        return Promise.reject(new Error(`Parsing error on line ${e.line}, column ${e.column}: ${e.message}`));
      }
    }
    catch (err) {
      if (err.message.match(/^maxContentLength size/)) {
        throw new Error(`stellar.toml file exceeds allowed size of ${STELLAR_TOML_MAX_SIZE}`);
      }
      else {
        throw err;
      }
    }
  }
}
