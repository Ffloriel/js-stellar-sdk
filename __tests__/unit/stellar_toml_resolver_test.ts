import StellarSdk from './../../src/index';
import axios from 'axios';

const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.get = jest.fn();

describe('stellar_toml_resolver.js tests', () => {

  describe('StellarTomlResolver.resolve', () => {
    beforeEach(StellarSdk.Config.setDefault);

    it('returns stellar.toml object for valid request and stellar.toml file', async function() {
      axiosMock.get.mockResolvedValue({
        data: `
          #   The endpoint which clients should query to resolve stellar addresses
          #   for users on your domain.
          FEDERATION_SERVER="https://api.stellar.org/federation"
        `,
        status: 200,
        statusText: 'OK',
        headers: null,
        config: {}
      });

      expect.assertions(1);
      const stellarToml = await StellarSdk.StellarTomlResolver.resolve('acme.com');
      expect(stellarToml.FEDERATION_SERVER).toBe('https://api.stellar.org/federation');
    });

    it('returns stellar.toml object for valid request and stellar.toml file when allowHttp is `true`', async function() {
      axiosMock.get.mockResolvedValue({
        data: `
          #   The endpoint which clients should query to resolve stellar addresses
          #   for users on your domain.
          FEDERATION_SERVER="http://api.stellar.org/federation"
        `,
        status: 200,
        statusText: 'OK',
        headers: null,
        config: {}
      });

      expect.assertions(1);
      const stellarToml = await StellarSdk.StellarTomlResolver.resolve('acme.com', {
        allowHttp: true
      });
      expect(stellarToml.FEDERATION_SERVER).toBe('http://api.stellar.org/federation');
    });

    it('returns stellar.toml object for valid request and stellar.toml file when global Config.allowHttp flag is set', async function() {
      StellarSdk.Config.setAllowHttp(true);

      axiosMock.get.mockResolvedValue({
        data: `
          #   The endpoint which clients should query to resolve stellar addresses
          #   for users on your domain.
          FEDERATION_SERVER="http://api.stellar.org/federation"
        `,
        status: 200,
        statusText: 'OK',
        headers: null,
        config: {}
      });

      expect.assertions(1);
      const stellarToml = await StellarSdk.StellarTomlResolver.resolve('acme.com');
      expect(stellarToml.FEDERATION_SERVER).toBe('http://api.stellar.org/federation');
    });

    it('rejects when stellar.toml file is invalid', async () => {
      axiosMock.get.mockResolvedValue({
        data: `
        /#   The endpoint which clients should query to resolve stellar addresses
        #   for users on your domain.
        FEDERATION_SERVER="https://api.stellar.org/federation"
        `,
        status: 200,
        statusText: 'OK',
        headers: null,
        config: {}
      });

      expect.assertions(1);
      return StellarSdk.StellarTomlResolver.resolve('acme.com')
          .catch(function(e: any) {
            expect(e.message).toMatch(/Parsing error on line/);
          })
    });

    it('rejects when there was a connection error', async () => {
      axiosMock.get.mockRejectedValue(new Error('connection error'));

      expect.assertions(1);
      return StellarSdk.StellarTomlResolver.resolve('acme.com')
        .catch(function(e: any) {
          expect(e.message).toBe('connection error')
        })
    });

  });
});
