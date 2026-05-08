import { cookies } from 'next/headers'
import { fetchMovieDetails } from '@/src/movieService'
import { fetchGenres } from '@/src/movieService'
import MovieCard from '@/src/components/MovieCard'
import { Movie } from '@/src/types/movie'

export default async function WatchlistPage() {
  const cookieStore = await cookies()
  const raw = cookieStore.get('watchlist')?.value
  const ids: number[] = raw ? JSON.parse(raw) : []

  if (ids.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center text-[#7d7d7f]">
        Your watchlist is empty. Add movies from its detail page.
      </div>
    )
  }

  const [movies, genreMap] = await Promise.all([
    Promise.all(ids.map((id) => fetchMovieDetails(id))),
    fetchGenres(),
  ])

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-white text-2xl font-bold mb-6">Watchlist</h1>
      <div className="flex flex-wrap">
        {movies.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} genres={genreMap} />
        ))}
      </div>
    </div>
  )
}
