import { prisma } from "../lib/prisma"

export async function findWatchlistByUserId(userId: string) {
  return prisma.watchlist.findMany({ where: { userId } })
}

export async function addToWatchlist(userId: string, movieId: number) {
  return prisma.watchlist.upsert({
    where: { userId_movieId: { userId, movieId } },
    update: {},
    create: { userId, movieId },
  })
}

export async function removeFromWatchlist(userId: string, movieId: number) {
  return prisma.watchlist.deleteMany({ where: { userId, movieId } })
}
