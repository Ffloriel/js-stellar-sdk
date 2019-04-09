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

class Config {

  static setAllowHttp(value: boolean): void {
    config.allowHttp = value;
  }

  static setTimeout(value: number): void {
    config.timeout = value;
  }

  static isAllowHttp(): boolean {
    return config.allowHttp;
  }

  static getTimeout(): number {
    return config.timeout;
  }

  static setDefault(): void {
    config = Object.assign({}, defaultConfig);
  }
}

export { Config };
