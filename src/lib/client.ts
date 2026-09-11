import Redis from 'ioredis';

import { RedisSentinelNode } from './config';

export interface CreateClientOptions {
  redisPort: number;
  redisUrl: string;
  redisAuth?: string;
  redisSentinels?: RedisSentinelNode[];
  redisSentinelName?: string;
}

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
    });
  }

  return new Redis(redisPort, redisUrl, { password: redisAuth });
};
