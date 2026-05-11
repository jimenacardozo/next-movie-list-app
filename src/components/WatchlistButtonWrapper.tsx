import { cookies } from 'next/headers'
import WatchlistButton from './WatchlistButton'

export default async function WatchlistButtonWrapper({
  movieId,
}: {
  movieId: number
}) {
  const cookieStore = await cookies()

  const raw = cookieStore.get('watchlist')?.value

  const watchlist: number[] = raw ? JSON.parse(raw) : []

  const isInWatchlist = watchlist.includes(movieId)

  return (
    <WatchlistButton
      movieId={movieId}
      isInWatchlist={isInWatchlist}
    />
  )
}