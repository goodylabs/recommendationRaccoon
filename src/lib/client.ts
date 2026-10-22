import Redis from 'ioredis';

import { RedisSentinelNode } from './config';

export interface CreateClientOptions {
  redisPort: number;
  redisUrl: string;
  redisAuth?: string;
  redisSentinels?: RedisSentinelNode[];
  redisSentinelName?: string;
}

// After a failover the old master stays up as a replica and keeps the existing connection, so every write fails
// with READONLY. Reconnecting makes ioredis ask Sentinel for the current master; 2 also resends the failed command.
export const reconnectOnReadonly = (error: Error): boolean | 2 => (error.message.startsWith('READONLY') ? 2 : false);

export const createClient = ({
  redisPort,
  redisUrl,
  redisAuth,
  redisSentinels,
  redisSentinelName,
}: CreateClientOptions) => {
  if (redisSentinels && redisSentinels.length > 0) {
    return new Redis({
      sentinels: redisSentinels,
      name: redisSentinelName || 'mymaster',
      password: redisAuth,
      reconnectOnError: reconnectOnReadonly,
    });
  }

  return new Redis(redisPort, redisUrl, { password: redisAuth });
};
