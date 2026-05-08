'use client';

import Link from 'next/link';
import fallbackPoster from '../../public/fallbackPoster.png';
import { Movie } from '../types/movie';
import Image from 'next/image';
import { useState } from 'react';

export default function MovieCard({ movie, genres }: {
    movie: Movie;
    genres: Record<number, string>;
}) {
    const [posterSrc, setPosterSrc] = useState<string | typeof fallbackPoster>(
        movie.poster_path
            ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
            : fallbackPoster
    );
    const year = movie.release_date?.split('-')[0] ?? '—';
    return (
        <Link href={`/movie/${movie.id}`} className='block m-4 min-w-44 w-1/5 max-w-xs'>
                <div className="bg-[#0e1011] border border-[#232426] rounded-xl overflow-hidden flex flex-col h-full">
                    <div className="relative">
                        <div className="absolute right-0 border border-[#232426] rounded-xl font-semibold text-[0.8rem] text-[#E57C46] bg-[#0F0C10] p-[0.3rem] m-[0.3rem]">
                            ★ {movie.vote_average.toFixed(1)}
                        </div>
                        <Image src={posterSrc} onError={() => setPosterSrc(fallbackPoster)} alt={movie.title} width={342} height={513} className="w-full h-auto" />
                    </div>
                    <div className="flex flex-col flex-1 p-[0.3rem] gap-[0.3rem]">
                        <h2 className="text-[1rem] text-white line-clamp-2 min-h-10">
                            {movie.title}
                        </h2>
                        <span className="text-[#7d7d7f]">{year}</span>
                        <div className="flex flex-wrap mt-auto">
                            {(movie.genre_ids ?? []).map((id) => (
                                <span key={id} className="text-[0.8rem] text-[#7d7d7f] border border-[#232426] rounded-xl bg-[#0e0f11] px-[0.3rem] py-[0.3rem] m-[0.3rem]">
                                    {genres[id]}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
        </Link>
    );
}
