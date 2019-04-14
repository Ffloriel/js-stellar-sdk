
// stellar-sdk classes to expose
export * from './errors';
import { Config } from './config';
import { Server } from './server';
import {
  FederationServer,
  FEDERATION_RESPONSE_MAX_SIZE
} from './federation_server';
import {
  StellarTomlResolver,
  STELLAR_TOML_MAX_SIZE
} from './stellar_toml_resolver';
export { default as HorizonAxiosClient } from './horizon_axios_client';

// expose classes and functions from stellar-base
import * as stellarBase from 'stellar-base';

// export default module.exports;

export default {
  Config,
  Server,
  FederationServer,
  FEDERATION_RESPONSE_MAX_SIZE,
  StellarTomlResolver,
  STELLAR_TOML_MAX_SIZE,
  ...stellarBase
};
