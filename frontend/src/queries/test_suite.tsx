//Testing user subscribe feature

import nock from 'nock';
import useSubscribeUserTicker from './subscribe-user-ticker';

describe('useSubscribeUserTicker', () => {
  it('should subscribe user to ticker', async () => {
    const args = { ticker: 'AAPL', userId: 'user1' };

    // Mock the API request
    nock('http://localhost:4000')
      .put(`/users/${args.userId}/ticker`, { tickers: args.ticker })
      .reply(200);

    const { subscribe } = useSubscribeUserTicker();
    await subscribe(args);

  });

  it('should handle error from API', async () => {
    const args = { ticker: 'AAPL', userId: 'user1' };

    // Mock the API request to return an error
    nock('http://localhost:4000')
      .put(`/users/${args.userId}/ticker`, { tickers: args.ticker })
      .reply(500);

    const { subscribe } = useSubscribeUserTicker();
    await subscribe(args);

  });
});
