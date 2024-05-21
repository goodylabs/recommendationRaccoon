import {
  scoreboardZSetKey,
  recommendedZSetKey,
  mostLikedKey,
  mostDislikedKey,
  similarityZSetKey,
  itemLikedBySetKey,
  itemDislikedBySetKey,
  userLikedSetKey,
  userDislikedSetKey
} from './key'
import { Redis } from 'ioredis'
import { chunk } from 'lodash'

const formatWithScoresResult = (result: string[]) => {
  return chunk(result, 2).map<[string, number]>(([id, score]) => {
    const s = parseFloat(score)
    return [id, s]
  })
}

export const recommendFor = function(
  client: Redis,
  className: string,
  userId: string,
  numberOfRecs: number
) {
  return client.zrevrange(
    recommendedZSetKey(className, userId),
    0,
    numberOfRecs
  )
}

export const recommendForWithScores = async function(
  client: Redis,
  className: string,
  userId: string,
  numberOfRecs: number
) {
  const recs = await client.zrevrange(
    recommendedZSetKey(className, userId),
    0,
    numberOfRecs,
    'WITHSCORES'
  )

  return formatWithScoresResult(recs)
}

export const bestRated = function(client: Redis, className: string) {
  return client.zrevrange(scoreboardZSetKey(className), 0, -1)
}
export const worstRated = function(client: Redis, className: string) {
  return client.zrange(scoreboardZSetKey(className), 0, -1)
}
export const bestRatedWithScores = async function(
  client: Redis,
  className: string,
  numOfRatings: number
) {
  const ratings = await client.zrevrange(
    scoreboardZSetKey(className),
    0,
    numOfRatings,
    'WITHSCORES'
  )
  return formatWithScoresResult(ratings)
}
export const mostLiked = function(client: Redis, className: string) {
  return client.zrevrange(mostLikedKey(className), 0, -1)
}
export const mostDisliked = function(client: Redis, className: string) {
  return client.zrevrange(mostDislikedKey(className), 0, -1)
}
export const usersWhoLikedAlsoLiked = async function(
  client: Redis,
  className: string,
  itemId: string
) {
  // Get the set of users who liked the item
  const users = await client.smembers(itemLikedBySetKey(className, itemId));

  // Prepare the keys for the liked sets of these users
  const likedSetKeys = users.map(userId => userLikedSetKey(className, userId));

  // Return empty array if there are no users who liked the item
  if(likedSetKeys.length === 0) {
    return [];
  }

  // Create a temporary key for the union set
  const tempKey = `usersWhoLikedAlsoLiked:${itemId}`;

  // Perform the union and store the result in the temporary set
  await client.sunionstore(tempKey, ...likedSetKeys);

  // Retrieve the items from the temporary set
  let items = await client.smembers(tempKey);

  // Delete the temporary set
  await client.del(tempKey);

  // Exclude the input item from the result
  items = items.filter(item => item !== itemId);

  return items;
}
export const mostSimilarUsers = function(
  client: Redis,
  className: string,
  userId: string
) {
  return client.zrevrange(similarityZSetKey(className, userId), 0, -1)
}
export const leastSimilarUsers = function(
  client: Redis,
  className: string,
  userId: string
) {
  return client.zrange(similarityZSetKey(className, userId), 0, -1)
}
export const likedBy = function(
  client: Redis,
  className: string,
  itemId: string
) {
  return client.smembers(itemLikedBySetKey(className, itemId))
}
export const likedCount = function(
  client: Redis,
  className: string,
  itemId: string
) {
  return client.scard(itemLikedBySetKey(className, itemId))
}
export const dislikedBy = function(
  client: Redis,
  className: string,
  itemId: string
) {
  return client.smembers(itemDislikedBySetKey(className, itemId))
}
export const dislikedCount = function(
  client: Redis,
  className: string,
  itemId: string
) {
  return client.scard(itemDislikedBySetKey(className, itemId))
}
export const allLikedFor = function(
  client: Redis,
  className: string,
  userId: string
) {
  return client.smembers(userLikedSetKey(className, userId))
}
export const allDislikedFor = function(
  client: Redis,
  className: string,
  userId: string
) {
  return client.smembers(userDislikedSetKey(className, userId))
}
export const allWatchedFor = function(
  client: Redis,
  className: string,
  userId: string
) {
  return client.sunion(
    userLikedSetKey(className, userId),
    userDislikedSetKey(className, userId)
  )
}
