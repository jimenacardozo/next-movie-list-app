import { Movie, MovieDetails, Genre } from '../types/movie';
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
        <section className="relative flex justify-center min-h-[90vh] bg-cover bg-center [backdrop-filter:blur(25px)_brightness(0.5)] overflow-hidden items-center">
            <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center [filter:blur(30px)_brightness(0.4)] scale-[1.3] -z-10 bg-[linear-gradient(to_top,black_20%,transparent_95%),var(--bg-image)]"
                style={{ '--bg-image': `url(${posterSrc})` } as React.CSSProperties}
            />
            <div className="px-12 relative z-10 flex flex-wrap gap-8 items-center justify-center text-center w-full max-w-[1200px] lg:justify-start lg:gap-16 lg:max-w-[1400px]">
                <Image
                    className="w-full max-w-[300px] rounded-xl h-auto lg:max-w-[400px]"
                    src={posterSrc}
                    alt={heroData.title}
                    width={500}
                    height={750}
                />
                <div className="flex flex-col gap-4 max-w-[600px] items-center lg:items-start lg:max-w-[800px]">
                    {showTrendingTag && (
                        <span className="font-medium bg-[#e97c48] px-[0.6rem] py-[0.2rem] rounded-xl inline-block">
                            #1 Trending
                        </span>
                    )}
                    <h1 className="text-white text-[2.5rem] m-0 lg:text-[4rem] lg:text-left">{heroData.title}</h1>
                    <div className="flex justify-around flex-wrap gap-[0.4rem] text-gray-400 lg:gap-6 lg:justify-start">
                        <span className="text-[#e97c48] font-extrabold">★ {heroData.rating}</span>
                        <span>{heroData.releaseYear}</span>
                        <span>◴ {heroData.duration}</span>
                        <div>
                            {heroData.genres.map((genre) =>(
                                <span key={genre.id} className="border border-gray-400 px-[0.6rem] py-[0.2rem] rounded-lg mx-[0.1rem] my-[0.1rem] inline-block">{genre.name}</span>
                            ))}
                        </div>
                    </div>
                    <p className="leading-[1.6] text-gray-400 lg:text-start lg:text-[1.2rem]">{heroData.overview}</p>
                    {heroData.trailerURL && (
                        <a href={heroData.trailerURL} target="_blank" rel="noreferrer" className="text-black no-underline font-medium bg-[#e97c48] p-[0.8rem] rounded-xl inline-block">▶ Watch Trailer</a>
                    )}
                </div>
            </div>
        </section>
    );
}
