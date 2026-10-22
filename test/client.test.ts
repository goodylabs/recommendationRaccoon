import Redis from 'ioredis';

import { createClient, reconnectOnReadonly } from '../src/lib/client';

jest.mock('ioredis');

const RedisMock = Redis as unknown as jest.Mock;

describe('createClient', () => {
  beforeEach(() => RedisMock.mockClear());

  it('reconnects on READONLY when connecting via Sentinel', () => {
    createClient({
      redisPort: 6379,
      redisUrl: '127.0.0.1',
      redisSentinels: [{ host: '10.0.0.1', port: 26379 }],
      redisSentinelName: 'dragonfly',
    });

    expect(RedisMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'dragonfly', reconnectOnError: reconnectOnReadonly }),
    );
  });

  it('does not change the single-host client', () => {
    createClient({ redisPort: 6379, redisUrl: '127.0.0.1' });

    expect(RedisMock).toHaveBeenCalledWith(6379, '127.0.0.1', { password: undefined });
  });
});

describe('reconnectOnReadonly', () => {
  it('reconnects and resends the command on READONLY', () => {
    expect(reconnectOnReadonly(new Error("READONLY You can't write against a read only replica."))).toBe(2);
  });

  it('ignores other errors', () => {
    expect(reconnectOnReadonly(new Error('ERR Out of memory'))).toBe(false);
    expect(reconnectOnReadonly(new Error('WRONGTYPE Operation against a key holding the wrong kind of value'))).toBe(
      false,
    );
  });
});
