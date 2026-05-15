import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { fetchMovieDetails, fetchGenres } from '@/src/movieService'
import MovieCard from '@/src/components/MovieCard'
import { Movie } from '@/src/types/movie'
import { getWatchlistForUser } from '@/src/services/watchlist.service'

async function WatchlistContent() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const items = await getWatchlistForUser(session.user.id)
  const ids = items.map((item) => item.movieId)

  if (ids.length === 0) {
    return (
      <div className="text-center text-[#7d7d7f]">
        Your watchlist is empty. Add movies from its detail page.
      </div>
    )
  }

  const [movies, genreMap] = await Promise.all([
    Promise.all(ids.map((id) => fetchMovieDetails(id))),
    fetchGenres(),
  ])

  return (
    <div className="flex flex-wrap">
      {movies.map((movie: Movie) => (
        <MovieCard key={movie.id} movie={movie} genres={genreMap} />
      ))}
    </div>
  )
}

export default function WatchlistPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-white text-2xl font-bold mb-6">Watchlist</h1>
      <Suspense fallback={<div className="text-[#7d7d7f]">Loading...</div>}>
        <WatchlistContent />
      </Suspense>
    </div>
  )
}
