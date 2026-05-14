import Link from 'next/link'
import { auth } from '@/auth'
import { isInWatchlist } from '@/src/services/watchlist.service'
import WatchlistButton from './WatchlistButton'

export default async function WatchlistButtonWrapper({
  movieId,
}: {
  movieId: number
}) {
  const session = await auth()

  if (!session?.user?.id) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#232426] bg-[#1A1B1D] text-white text-sm font-medium hover:bg-[#232426] transition-colors"
      >
        <span className="text-lg leading-none">+</span>
        Sign in to add to Watchlist
      </Link>
    )
  }

  const inWatchlist = await isInWatchlist(session.user.id, movieId)

  return (
    <WatchlistButton
      movieId={movieId}
      isInWatchlist={inWatchlist}
    />
  )
}