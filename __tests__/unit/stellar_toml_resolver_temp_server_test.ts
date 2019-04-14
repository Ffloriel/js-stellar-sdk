import http from 'http';
import StellarSdk from './../../src/index';

describe('stellar_toml_resolver_temp_server', () => {
  it('fails when response exceeds the limit', async () => {
    const response = Array(StellarSdk.STELLAR_TOML_MAX_SIZE + 10).join('a');
    const tempServer = http
      .createServer((req, res) => {
        res.setHeader('Content-Type', 'text/x-toml; charset=UTF-8');
        res.end(response);
      })
      .listen(4441, () => {
        StellarSdk.StellarTomlResolver.resolve('localhost:4441', {
          allowHttp: true
        })
        .catch(function(e: any) {
          expect(e.message).toMatch(/stellar.toml file exceeds allowed size of [0-9]+/);
        })
        .finally(tempServer.close);
      });
  });

  it('rejects after given timeout when global Config.timeout flag is set', async () => {
    StellarSdk.Config.setTimeout(1000);

    const tempServer = http
      .createServer((req, res) => {
        setTimeout(() => {}, 10000);
      })
      .listen(4442, () => {
        StellarSdk.StellarTomlResolver.resolve('localhost:4442', {
          allowHttp: true
        }).catch(function(e: any) {
          expect(e.message).toMatch(/timeout of 1000ms exceeded/);
        })
        .finally(() => {
          StellarSdk.Config.setDefault();
          tempServer.close();
        });
      });
  });

  it('rejects after given timeout when timeout specified in StellarTomlResolver opts param', async () => {
    const tempServer = http
      .createServer((req, res) => {
        setTimeout(() => {}, 10000);
      })
      .listen(4443, () => {
        StellarSdk.StellarTomlResolver.resolve('localhost:4443', {
          allowHttp: true,
          timeout: 1000
        })
        .catch((e: any) => {
          expect(e.message).toMatch(/timeout of 1000ms exceeded/);
        })
        .finally(tempServer.close);

      });
  });
})