import MovieCard from "./MovieCard";
import { Movie } from '../types/movie';

interface ContentGridProps {
    movies: Movie[] | null;
    genres: Record<number, string>;
    error: string | null;
}

export default function ContentGrid({ movies, genres, error }: ContentGridProps) {
    if (error) {
        return (
            <div className="flex flex-wrap justify-center" id="content-grid">
                <p className="text-[#7d7d7f] text-[1.2rem] text-center mt-8">{error}</p>
            </div>
        );
    };

    if (!movies || movies.length === 0) {
        return (
            <div className="flex flex-wrap justify-center" id="content-grid">
                <p className="text-[#7d7d7f] text-[1.2rem] text-center mt-8">No movies found</p>
            </div>
        );
    };
    return (
        <div className="flex flex-wrap justify-center" id="content-grid">
            {movies.map(movie => {
                return <MovieCard key={movie.id} movie={movie} genres={genres}></MovieCard>
            })}
        </div>
    );
}
