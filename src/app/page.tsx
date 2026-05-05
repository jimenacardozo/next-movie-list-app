import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import './global.css'
import { fetchMovies, fetchGenres, fetchMovieDetails } from '../movieService'
import { fetchTrendingMovies } from '../movieService'
import MovieSection from '../components/MovieSection'

export default async function HomePage(){
  const genres = await fetchGenres();
  const movies = await fetchMovies();
  const trendingMovies = await fetchTrendingMovies();
  const trendingMovie = trendingMovies?.[0];
  if (!trendingMovie) {
    return <div>No movies available at the moment.</div>;
  }
  const details = await fetchMovieDetails(trendingMovie.id);

  return (
    <>
      <Header />
      <Hero
        movie={trendingMovie}
        genres={genres}
        details={details}
      />
      <MovieSection genres={genres}/>
      <Footer />
    </>
  )
}
