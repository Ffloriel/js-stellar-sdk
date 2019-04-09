import http from 'http';
import axios from 'axios';
import sinon from 'sinon';
import StellarSdk from './../../src/index';

describe('stellar_toml_resolver.js tests', function() {
  let axiosMock: any;

  beforeEach(function() {
    axiosMock = sinon.mock(axios);
    StellarSdk.Config.setDefault();
  });

  afterEach(function() {
    axiosMock.verify();
    axiosMock.restore();
  });

  describe('StellarTomlResolver.resolve', function() {
    beforeEach(function() {
      axiosMock = sinon.mock(axios);
      StellarSdk.Config.setDefault();
    });
  
    afterEach(function() {
      StellarSdk.Config.setDefault();
      axiosMock.verify();
      axiosMock.restore();
    });

    it('returns stellar.toml object for valid request and stellar.toml file', function(done) {
      axiosMock
        .expects('get')
        .withArgs(sinon.match('https://acme.com/.well-known/stellar.toml'))
        .returns(
          Promise.resolve({
            data: `
#   The endpoint which clients should query to resolve stellar addresses
#   for users on your domain.
FEDERATION_SERVER="https://api.stellar.org/federation"
`
          })
        );

      StellarSdk.StellarTomlResolver.resolve('acme.com').then((stellarToml: any) => {
        expect(stellarToml.FEDERATION_SERVER).toBe(
          'https://api.stellar.org/federation'
        );
        done();
      });
    });

    it('returns stellar.toml object for valid request and stellar.toml file when allowHttp is `true`', function(done) {
      axiosMock
        .expects('get')
        .withArgs(sinon.match('http://acme.com/.well-known/stellar.toml'))
        .returns(
          Promise.resolve({
            data: `
#   The endpoint which clients should query to resolve stellar addresses
#   for users on your domain.
FEDERATION_SERVER="http://api.stellar.org/federation"
`
          })
        );

      StellarSdk.StellarTomlResolver.resolve('acme.com', {
        allowHttp: true
      }).then((stellarToml: any) => {
        expect(stellarToml.FEDERATION_SERVER).toBe(
          'http://api.stellar.org/federation'
        );
        done();
      });
    });

    it('returns stellar.toml object for valid request and stellar.toml file when global Config.allowHttp flag is set', function(done) {
      StellarSdk.Config.setAllowHttp(true);

      axiosMock
        .expects('get')
        .withArgs(sinon.match('http://acme.com/.well-known/stellar.toml'))
        .returns(
          Promise.resolve({
            data: `
#   The endpoint which clients should query to resolve stellar addresses
#   for users on your domain.
FEDERATION_SERVER="http://api.stellar.org/federation"
`
          })
        );

      StellarSdk.StellarTomlResolver.resolve('acme.com').then((stellarToml: any) => {
        expect(stellarToml.FEDERATION_SERVER).toBe(
          'http://api.stellar.org/federation'
        );
        done();
      });
    });

    it('rejects when stellar.toml file is invalid', async () => {
      axiosMock
        .expects('get')
        .withArgs(sinon.match('https://acme.com/.well-known/stellar.toml'))
        .returns(
          Promise.resolve({
            data: `
              /#   The endpoint which clients should query to resolve stellar addresses
              #   for users on your domain.
              FEDERATION_SERVER="https://api.stellar.org/federation"
              `
          })
        );

      expect.assertions(1);
      return StellarSdk.StellarTomlResolver.resolve('acme.com')
          .catch(function(e: any) {
            expect(e.message).toMatch(/Parsing error on line/);
          })
    });

    it('rejects when there was a connection error', async () => {
      axiosMock
        .expects('get')
        .withArgs(sinon.match('https://acme.com/.well-known/stellar.toml'))
        .returns(Promise.reject(new Error('connection error')));

      expect.assertions(1);
      return StellarSdk.StellarTomlResolver.resolve('acme.com')
        .catch(function(e: any) {
          expect(e.message).toBe('connection error')
        })
    });

    it('fails when response exceeds the limit', function(done) {
      // Unable to create temp server in a browser
      if (typeof window != 'undefined') {
        return done();
      }
      var response = Array(StellarSdk.STELLAR_TOML_MAX_SIZE + 10).join('a');
      let tempServer = http
        .createServer((req, res) => {
          res.setHeader('Content-Type', 'text/x-toml; charset=UTF-8');
          res.end(response);
        })
        .listen(4444, () => {
          StellarSdk.StellarTomlResolver.resolve('localhost:4444', {
            allowHttp: true
          })
            .should.be.rejectedWith(
              /stellar.toml file exceeds allowed size of [0-9]+/
            )
            .notify(done)
            .then(() => tempServer.close());
        });
    });

    it('rejects after given timeout when global Config.timeout flag is set', function(done) {
      StellarSdk.Config.setTimeout(1000);

      // Unable to create temp server in a browser
      if (typeof window != 'undefined') {
        return done();
      }

      let tempServer = http
        .createServer((req, res) => {
          setTimeout(() => {}, 10000);
        })
        .listen(4444, () => {
          StellarSdk.StellarTomlResolver.resolve('localhost:4444', {
            allowHttp: true
          })
            .should.be.rejectedWith(/timeout of 1000ms exceeded/)
            .notify(done)
            .then(() => {
              StellarSdk.Config.setDefault();
              tempServer.close();
            });
        });
    });

    it('rejects after given timeout when timeout specified in StellarTomlResolver opts param', function(done) {
      // Unable to create temp server in a browser
      if (typeof window != 'undefined') {
        return done();
      }

      let tempServer = http
        .createServer((req, res) => {
          setTimeout(() => {}, 10000);
        })
        .listen(4444, () => {
          StellarSdk.StellarTomlResolver.resolve('localhost:4444', {
            allowHttp: true,
            timeout: 1000
          })
            .should.be.rejectedWith(/timeout of 1000ms exceeded/)
            .notify(done)
            .then(() => tempServer.close());
        });
    });
  });
});
