import Config, { ConfigArgs } from './config'
import { createClient } from './client'
import { Redis } from 'ioredis'
import {
  liked,
  disliked,
  unliked,
  undisliked,
  UpdateRecsOptions
} from './input'

import {
  updateSimilarityFor,
  updateWilsonScore,
  updateRecommendationsFor,
  predictFor,
  similaritySum
} from './algorithms'
import {
  recommendFor,
  bestRated,
  worstRated,
  bestRatedWithScores,
  mostLiked,
  mostDisliked,
  mostSimilarUsers,
  leastSimilarUsers,
  likedBy,
  likedCount,
  dislikedBy,
  dislikedCount,
  allLikedFor,
  allDislikedFor,
  allWatchedFor,
  recommendForWithScores,
  usersWhoLikedAlsoLiked
} from './stat'

export default class Raccoon {
  config: Config
  client: Redis
  constructor(config: ConfigArgs) {
    this.config = new Config(config)
    this.client = createClient(
      this.config.redisPort,
      this.config.redisUrl,
      this.config.redisAuth
    )
  }

  liked(userId: string, itemId: string, options: UpdateRecsOptions = {}) {
    this.config.logger.debug(`[Raccoon] liked: ${userId} ${itemId}`)
    return liked(this.client, this.config, userId, itemId, options)
  }

  disliked(userId: string, itemId: string, options: UpdateRecsOptions = {}) {
    this.config.logger.debug(`[Raccoon] disliked: ${userId} ${itemId}`)
    return disliked(this.client, this.config, userId, itemId, options)
  }

  unliked(userId: string, itemId: string, options: UpdateRecsOptions = {}) {
    return unliked(this.client, this.config, userId, itemId, options)
  }

  undisliked(userId: string, itemId: string, options: UpdateRecsOptions = {}) {
    return undisliked(this.client, this.config, userId, itemId, options)
  }

  updateSimilarityFor(userId: string) {
    return updateSimilarityFor(this.client, this.config, userId)
  }

  predictFor(userId: string, itemId: string) {
    return predictFor(this.client, this.config.className, userId, itemId)
  }

  similaritySum(simSet: string, compSet: string) {
    return similaritySum(this.client, simSet, compSet)
  }

  updateRecommendationsFor(userId: string) {
    return updateRecommendationsFor(
      this.client,
      this.config.className,
      this.config.nearestNeighbors,
      this.config.numOfRecsStore,
      userId
    )
  }

  updateWilsonScore(itemId: string) {
    return updateWilsonScore(this.client, this.config, itemId)
  }

  recommendFor(userId: string, numberOfRecs: number) {
    return recommendFor(
      this.client,
      this.config.className,
      userId,
      numberOfRecs
    )
  }

  recommendForWithScores(userId: string, numberOfRecs: number) {
    return recommendForWithScores(
      this.client,
      this.config.className,
      userId,
      numberOfRecs
    )
  }

  bestRated() {
    return bestRated(this.client, this.config.className)
  }

  worstRated() {
    return worstRated(this.client, this.config.className)
  }

  bestRatedWithScores(numOfRatings: number) {
    return bestRatedWithScores(this.client, this.config.className, numOfRatings)
  }

  mostLiked() {
    return mostLiked(this.client, this.config.className)
  }

  mostDisliked() {
    return mostDisliked(this.client, this.config.className)
  }

  mostSimilarUsers(userId: string) {
    return mostSimilarUsers(this.client, this.config.className, userId)
  }

  leastSimilarUsers(userId: string) {
    return leastSimilarUsers(this.client, this.config.className, userId)
  }

  likedBy(itemId: string) {
    return likedBy(this.client, this.config.className, itemId)
  }

  likedCount(itemId: string) {
    return likedCount(this.client, this.config.className, itemId)
  }

  dislikedBy(itemId: string) {
    return dislikedBy(this.client, this.config.className, itemId)
  }

  dislikedCount(itemId: string) {
    return dislikedCount(this.client, this.config.className, itemId)
  }

  allLikedFor(userId: string) {
    return allLikedFor(this.client, this.config.className, userId)
  }

  allDislikedFor(userId: string) {
    return allDislikedFor(this.client, this.config.className, userId)
  }

  allWatchedFor(userId: string) {
    return allWatchedFor(this.client, this.config.className, userId)
  }

  usersWhoLikedAlsoLiked(itemId: string) {
    return usersWhoLikedAlsoLiked(this.client, this.config.className, itemId)
  }

  close() {
    this.client.disconnect()
  }
}
