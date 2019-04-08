export type Configuration = {
  // Allow connecting to http servers, default: `false`. This must be set to false in production deployments!
  allowHttp: boolean;
  // Allow a timeout, default: 0. Allows user to avoid nasty lag due to TOML resolve issue. You can also use {@link Config} class to set this globally.
  timeout: number;
}

const defaultConfig: Configuration = {
  allowHttp: false,
  timeout: 0
};

let config: Configuration = Object.assign({}, defaultConfig);

/**
 * Global config class.
 *
 * Usage node:
 * ```
 * import {Config} from 'stellar-sdk';
 * Config.setAllowHttp(true);
 * Config.setTimeout(5000);
 * ```
 *
 * Usage browser:
 * ```
 * StellarSdk.Config.setAllowHttp(true);
 * StellarSdk.Config.setTimeout(5000);
 * ```
 * @static
 */
class Config {
  /**
   * Sets `allowHttp` flag globally. When set to `true`, connections to insecure http protocol servers will be allowed.
   * Must be set to `false` in production. Default: `false`.
   * @static
   */
  static setAllowHttp(value: boolean): void {
    config.allowHttp = value;
  }

  /**
   * Sets `timeout` flag globally. When set to anything besides 0, the request will timeout after specified time (ms).
   * Default: 0.
   * @static
   */
  static setTimeout(value: number): void {
    config.timeout = value;
  }

  /**
   * @static
   * @returns {boolean} allowHttp flag
   */
  static isAllowHttp() {
    return config.allowHttp;
  }

  static getTimeout(): number {
    return config.timeout;
  }

  /**
   * Sets all global config flags to default values.
   */
  static setDefault(): void {
    config = Object.assign({}, defaultConfig);
  }
}

export { Config };
