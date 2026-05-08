'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getWatchlist(): Promise<number[]> {
    const cookieStore = await cookies()
    const raw = cookieStore.get('watchlist')?.value
    if (!raw) return []
    try {
        return JSON.parse(raw)
    } catch {
        return []
    }
}

async function saveWatchlist (ids: number[]) {
    const cookieStore = await cookies()
    cookieStore.set('watchlist', JSON.stringify(ids), {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
    })
}

export async function addToWatchlist(movieId: number) {
    const list = await getWatchlist();
    if (!list.includes(movieId)) {
        await saveWatchlist([...list, movieId])
    };
    revalidatePath(`/movie/${movieId}`)
}

export async function removeFromWatchlist(movieId: number) {
  const list = await getWatchlist()
  await saveWatchlist(list.filter((id) => id !== movieId))
  revalidatePath(`/movie/${movieId}`)
}