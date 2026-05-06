import { Movie, MovieDetails, Genre } from '../types/movie';
import styles from './Hero.module.css';
import Image from 'next/image';

export default function Hero( {genres, movie, details, genreList, showTrendingTag} : {genres?: Record<number, string>, movie: Movie | null, details: MovieDetails, genreList?: Genre[], showTrendingTag?: boolean} ) {
    if (!movie) return null;

    const heroData = {
        title: movie.title,
        releaseYear: movie.release_date.split('-')[0],
        rating: movie.vote_average.toFixed(1),
        duration: details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : 'Unknown',
        overview: movie.overview,
        trailerURL: details.trailerURL,
        genres: genreList ?? (movie.genre_ids ?? []).map(id => ({
            id: id,
            name: genres?.[id] ?? ''
        }))
    };

    const posterSrc = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    
    return (
        <section className={styles.hero}>
            <div
                className={styles.heroBackground}
                style={{ '--bg-image': `url(${posterSrc})` } as React.CSSProperties}
            />
            <div className={styles.heroContent}>
                <Image className={styles.heroImage} src={posterSrc} alt={heroData.title} width={500} height={750} />
                <div className={styles.heroInfo}>
                    {showTrendingTag && <span className={styles.trendingTag}>#1 Trending</span>}
                    <h1>{heroData.title}</h1>
                    <div className={styles.heroMovieDetails}>
                        <span className={styles.rating}>★ {heroData.rating}</span>
                        <span className={styles.year}>{heroData.releaseYear}</span>
                        <span className={styles.duration}>◴ {heroData.duration}</span>
                        <div>
                            {heroData.genres.map((genre) =>(
                                <span key={genre.id} className={styles.genre}>{genre.name}</span>
                            ))}
                        </div>
                    </div>
                    <p className={styles.heroDescription}>{heroData.overview}</p>
                    {heroData.trailerURL && (
                        <a href={heroData.trailerURL} target="_blank" rel="noreferrer" className={styles.buttonTrailer}>▶ Watch Trailer</a>
                    )}
                </div>
            </div>
        </section>
    );
}
