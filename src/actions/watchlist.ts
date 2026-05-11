'use server'

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import {
  getWatchlistForUser,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
} from "../services/watchlist.service"

export async function addToWatchlist(movieId: number) {
  const session = await auth()
  if (!session?.user?.id) return
  await addMovieToWatchlist(session.user.id, movieId)
  revalidatePath(`/movie/${movieId}`)
}

export async function removeFromWatchlist(movieId: number) {
  const session = await auth()
  if (!session?.user?.id) return
  await removeMovieFromWatchlist(session.user.id, movieId)
  revalidatePath(`/movie/${movieId}`)
}

export async function getWatchlist(): Promise<number[]> {
  const session = await auth()
  if (!session?.user?.id) return []
  const items = await getWatchlistForUser(session.user.id)
  return items.map((item: { movieId: number }) => item.movieId)
}
