import { SERVER_TIME_MAP, getCurrentServerTime, interceptorHorizonResponse } from '../../src/horizon_axios_client';

describe('getCurrentServerTime', () => {
  beforeEach(() => {
    // set it to 50 seconds
    global.Date.prototype.getTime = jest.fn().mockReturnValue(5050 * 1000);
  });

  it('returns null when the hostname hasnt been hit', () => {
    expect(getCurrentServerTime('host')).toBe(null);
  });

  it('returns null when the old time is too old', () => {
    SERVER_TIME_MAP.set('host', {
      serverTime: 10,
      localTimeRecorded: 5
    });
    expect(getCurrentServerTime('host')).toBe(null);
  });

  it('returns the delta between then and now', () => {
    SERVER_TIME_MAP.set('host', {
      serverTime: 10,
      localTimeRecorded: 5005
    });
    expect(getCurrentServerTime('host')).toBe(55);
  });
});

describe('interceptorHorizonResponse', () => {
  const originalResponse = {
    data: {},
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      url: 'https://example.com'
    }
  }

  beforeEach(() => {
    SERVER_TIME_MAP.clear();
  })
  it('returns the original response', () => {
    const response = interceptorHorizonResponse(originalResponse);
    expect(response).toEqual(originalResponse);
    expect(SERVER_TIME_MAP.has('example.com')).toBe(false);
  });

  it('saves the server time information if Date header is present', () => {
    interceptorHorizonResponse({
      ...originalResponse,
      headers: {
        Date: 'Wed, 13 Mar 2019 22:15:07 GMT'
      }
    })
    expect(SERVER_TIME_MAP.has('example.com')).toBe(true);
    const serverTimeInfo = SERVER_TIME_MAP.get('example.com');
    expect(serverTimeInfo).toEqual({
      localTimeRecorded: 5050,
      serverTime: 1552515307,
    });
  })

});