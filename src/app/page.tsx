import Hero from '../components/Hero'
import './global.css'
import { fetchGenres, fetchMovieDetails, fetchMovieVideos } from '../movieService'
import { fetchTrendingMovies } from '../movieService'
import MovieSection from '../components/MovieSection'
import { Suspense } from 'react'

export default async function HomePage(){
  const genres = await fetchGenres();
  const trendingData = await fetchTrendingMovies();
  const trendingMovie = trendingData?.results?.[0];
  if (!trendingMovie) {
    return <div>No movies available at the moment.</div>;
  }
  const [movieDetails, videos] = await Promise.all([
    fetchMovieDetails(trendingMovie.id),
    fetchMovieVideos(trendingMovie.id),
  ]);
  const trailerVideo = videos?.results?.find(
    (v: { site: string; type: string; key: string }) => v.site === 'YouTube' && v.type === 'Trailer'
  );
  const details = {
    ...movieDetails,
    trailerURL: trailerVideo ? `https://www.youtube.com/watch?v=${trailerVideo.key}` : null,
  };

  return (
    <>
      <Hero
        movie={trendingMovie}
        genres={genres}
        details={details}
        showTrendingTag={true}
      />
      <Suspense>
        <MovieSection genres={genres}/>
      </Suspense>
    </>
  )
}
