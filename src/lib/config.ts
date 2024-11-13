import { createLogger, transports, Logger } from "winston";

const activeTransports: any[] = [new transports.Console()];

export interface ConfigArgs {
  nearestNeighbors?: number
  className?: string
  numOfRecsStore?: number
  factorLeastSimilarLeastLiked?: boolean
  redisUrl?: string
  redisPort?: number
  redisAuth?: string
  logger?: Logger
}

export default class Config {
  nearestNeighbors: number
  className: string
  numOfRecsStore: number
  factorLeastSimilarLeastLiked: boolean
  redisUrl: string
  redisPort: number
  redisAuth: string
  logger: Logger
  constructor({
    nearestNeighbors,
    className,
    numOfRecsStore,
    factorLeastSimilarLeastLiked,
    redisUrl,
    redisPort,
    redisAuth,
    logger,
  }: ConfigArgs) {
    this.nearestNeighbors = nearestNeighbors || 5
    this.className = className || 'movie'
    this.numOfRecsStore = numOfRecsStore || 30
    this.factorLeastSimilarLeastLiked = factorLeastSimilarLeastLiked || false
    this.redisUrl = redisUrl || process.env.RACCOON_REDIS_URL || '127.0.0.1'
    this.redisPort =
      redisPort ||
      (process.env.RACCOON_REDIS_PORT
        ? parseInt(process.env.RACCOON_REDIS_PORT)
        : 6379)
    this.redisAuth = redisAuth || process.env.RACCOON_REDIS_AUTH || ''

    if (logger) {
      this.logger = logger
    } else {
      this.logger = createLogger({
        level: 'error',
        exitOnError: false,
        transports: activeTransports,
      });
    }

  }
}
