import Hero from '../components/Hero'
import './global.css'
import { fetchGenres, fetchMovieDetails } from '../movieService'
import { fetchTrendingMovies } from '../movieService'
import MovieSection from '../components/MovieSection'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "CineVault",
};

export default async function HomePage(){
  const genres = await fetchGenres();
  const trendingData = await fetchTrendingMovies();
  const trendingMovie = trendingData?.results?.[0];
  if (!trendingMovie) {
    return <div>No movies available at the moment.</div>;
  }
  const details = await fetchMovieDetails(trendingMovie.id);

  return (
    <>
      <Hero
        movie={trendingMovie}
        genres={genres}
        details={details}
        showTrendingTag={true}
      />
      <MovieSection genres={genres}/>
    </>
  )
}
