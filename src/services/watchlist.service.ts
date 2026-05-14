import {
  findWatchlistByUserId,
  isMovieInWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../dal/watchlist.dal"

export async function getWatchlistForUser(userId: string) {
  return findWatchlistByUserId(userId)
}

export async function isInWatchlist(userId: string, movieId: number) {
  return isMovieInWatchlist(userId, movieId)
}

export async function addMovieToWatchlist(userId: string, movieId: number) {
  return addToWatchlist(userId, movieId)
}

export async function removeMovieFromWatchlist(userId: string, movieId: number) {
  return removeFromWatchlist(userId, movieId)
}
