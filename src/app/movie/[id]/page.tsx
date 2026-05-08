import { fetchMovieCredits, fetchMovieDetails, fetchMovieVideos, fetchTrendingMovies } from "@/src/movieService"
import Hero from "@/src/components/Hero"
import MovieInfo from "@/src/components/MovieInfo"
import { cookies } from 'next/headers'
import WatchlistButton from '@/src/components/WatchlistButton'

export const revalidate = 60 * 60 * 24;

export async function generateMetadata(
  { params } : { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const movie = await fetchMovieDetails(Number(id));
  
  return {
    title: `${movie.title}`,
  };
}

export async function generateStaticParams(){
  const movies = await fetchTrendingMovies();

  return movies.results
    .slice(0, 20)
    .map((movie: {id: number}) => ({
      id: movie.id.toString(),
    }))
}

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cookieStore = await cookies()
  const raw = cookieStore.get('watchlist')?.value
  const watchlist: number[] = raw ? JSON.parse(raw) : []
  const isInWatchlist = watchlist.includes(Number(id))

  const [movie, videos, credits] = await Promise.all([
    fetchMovieDetails(Number(id)),
    fetchMovieVideos(Number(id)),
    fetchMovieCredits(Number(id)),
  ])

  const trailerVideo = videos?.results?.find(
    (v: { site: string; type: string; key: string }) => v.site === 'YouTube' && v.type === 'Trailer'
  )
  const details = {
    ...movie,
    trailerURL: trailerVideo ? `https://www.youtube.com/watch?v=${trailerVideo.key}` : null,
  }

  return (
    <>
      <Hero movie={movie} details={details} genreList={movie.genres} />
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <WatchlistButton movieId={Number(id)} isInWatchlist={isInWatchlist} />
      </div>
      <MovieInfo movie={movie} credits={credits} />
    </>
  )
}