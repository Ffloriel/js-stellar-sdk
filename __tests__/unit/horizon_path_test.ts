import axios, { AxiosResponse } from 'axios';
import { when } from 'jest-when';
import StellarSdk, { HorizonAxiosClient } from './../../src/index'

const horizonAxiosClientMock = HorizonAxiosClient as jest.Mocked<typeof HorizonAxiosClient>;
horizonAxiosClientMock.get = jest.fn();
horizonAxiosClientMock.post = jest.fn();

const prepareAxios = (serverUrl: string, endpoint: string, randomResult: AxiosResponse) => {
  randomResult.data.endpoint = endpoint;
  when(horizonAxiosClientMock.get).calledWith(expect.stringMatching(`${serverUrl}${endpoint}`)).mockResolvedValue(randomResult);
}

const testHorizonPaths = (serverUrl: string) => {
  const server = new StellarSdk.Server(serverUrl);
  const randomResult: AxiosResponse = {
    data: {
      url: serverUrl,
      random: Math.round(1000 * Math.random()),
      endpoint: 'bogus'
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  };

  it(`server.accounts() ${serverUrl}`, async () => {
    prepareAxios(serverUrl, '/accounts', randomResult);
    expect.assertions(1);
    const accounts = await server.accounts().call();
    expect(accounts).toEqual(randomResult.data);
  })

  it(`server.accounts().accountId('fooAccountId) ${serverUrl}`, async () => {
    prepareAxios(serverUrl, '/accounts/fooAccountId', randomResult);
    expect.assertions(1);
    const accountId = await server.accounts().accountId('fooAccountId').call();
    expect(accountId).toEqual(randomResult.data);
  })

  it(`server.transactions() ${serverUrl}`, async () => {
    prepareAxios(serverUrl, '/transactions', randomResult);
    expect.assertions(1);
    const transactions = await server.transactions().call();
    expect(transactions).toEqual(randomResult.data);
  })

  it(`server.transaction().includeFailed(true) ${serverUrl}`, async() => {
    prepareAxios(serverUrl, '/transactions?include_failed=true', randomResult);
    expect.assertions(1);
    const transactions = await server.transactions().includeFailed(true).call();
    expect(transactions).toEqual(randomResult.data);
  })

  it(`server.operations().includeFailed(true) ${serverUrl}`, async() => {
    prepareAxios(serverUrl, '/operations?include_failed=true', randomResult);
    expect.assertions(1);
    const operations = await server.operations().includeFailed(true).call();
    expect(operations).toEqual(randomResult.data);
  })

  it(`server.transactions().transaction('fooTransactionId')  ${serverUrl}`, async() => {
    prepareAxios(serverUrl, '/transactions/fooTransactionId', randomResult);
    expect.assertions(1);
    const transaction = await server.transactions().transaction('fooTransactionId').call();
    expect(transaction).toEqual(randomResult.data);
  })

  it(`server.transactions().forAccount('fooAccountId) ${serverUrl}`, async() => {
    prepareAxios(serverUrl, '/accounts/fooAccountId/transactions', randomResult);
    expect.assertions(1);
    const transactions = await server.transactions().forAccount('fooAccountId').call();
    expect(transactions).toEqual(randomResult.data);
  })

  it(`server.submitTransaction() ${serverUrl}`, async() => {
    randomResult.data.endpoint = 'post';
    const keypair = StellarSdk.Keypair.random();
    const account = new StellarSdk.Account(keypair.publicKey(), '56199647068161');
    const fakeTransaction = new StellarSdk.TransactionBuilder(account, { fee: 100 })
      .addOperation(StellarSdk.Operation.payment({
        destination: keypair.publicKey(),
        asset: StellarSdk.Asset.native(),
        amount: '100.50'
      }))
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build();
    fakeTransaction.sign(keypair);
    const tx = encodeURIComponent(fakeTransaction.toEnvelope().toXDR().toString('base64'));
    // when(horizonAxiosClientMock.get).calledWith(`${serverUrl}/transactions?tx=${tx}`).mockResolvedValue(randomResult);
    horizonAxiosClientMock.post.mockResolvedValue(randomResult);
    
    expect.assertions(1);
    const response = await server.submitTransaction(fakeTransaction);
    expect(response).toEqual(randomResult.data);
  })
}

describe('horizon path tests', () => {
  beforeEach(() => {
    StellarSdk.Config.setDefault();
    StellarSdk.Network.useTestNetwork();
  });

  ;[
  //server url without folder path.
  'https://acme.com:1337',
  //server url folder path.
  'https://acme.com:1337/folder',
  //server url folder and subfolder path.
  'https://acme.com:1337/folder/subfolder'
  ].forEach(serverUrl => {
    testHorizonPaths(serverUrl);
  });

});
