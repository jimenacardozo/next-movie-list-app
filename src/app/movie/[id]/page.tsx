import { fetchMovieCredits, fetchMovieDetails, fetchMovieVideos } from "@/src/movieService"
import Hero from "@/src/components/Hero"

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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
    </>
  )
}