'use server'

import { CONFIG } from "./config";
import { Genre, MovieCredits, MovieDetails, MovieSearchParams } from "./types/movie";
import { cacheTag, cacheLife } from "next/cache";

const API_BASE = "https://api.themoviedb.org/3";

const headers = {
    accept: "application/json",
    Authorization: `Bearer ${CONFIG.API_KEY}`,
};

export async function fetchTrendingMovies() {
    'use cache'
    cacheLife('hours')
    cacheTag('trending')
    console.log('[cache miss] fetchTrendingMovies — fetching from TMDB')
    const res = await fetch(`${API_BASE}/trending/movie/day`, { headers });
    if (!res.ok) throw new Error(`Error fetching trending: ${res.status}`);
    return res.json();
}

export async function fetchMovieDetails(movieId: number): Promise<MovieDetails> {
    'use cache'
    cacheLife('days')
    cacheTag('movies', `movie-${movieId}`)
    console.log(`[cache miss] fetchMovieDetails(${movieId}) — fetching from TMDB`)
    const res = await fetch(`${API_BASE}/movie/${movieId}`, { headers });
    if (!res.ok) throw new Error(`Error fetching details: ${res.status}`);
    return res.json();
}

export async function fetchMovieVideos(movieId: number) {
    'use cache'
    cacheLife('days')
    cacheTag('movies', `movie-${movieId}`)
    console.log(`[cache miss] fetchMovieVideos(${movieId}) — fetching from TMDB`)
    const res = await fetch(`${API_BASE}/movie/${movieId}/videos`, { headers });
    if (!res.ok) throw new Error(`Error fetching videos: ${res.status}`);
    return res.json();
}

export async function fetchGenres() {
    'use cache'
    cacheLife('max')
    cacheTag('genres')
    console.log('[cache miss] fetchGenres — fetching from TMDB')
    const res = await fetch(`${API_BASE}/genre/movie/list`, { headers });
    if (!res.ok) throw new Error(`Error fetching genres: ${res.status}`);
    const data = await res.json();
    return Object.fromEntries(data.genres.map((g: Genre) => [g.id, g.name]));
}

export async function fetchMovies(params: MovieSearchParams = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "" && v !== "all") {
            searchParams.set(k, v as string);
        }
    });

    const endpoint = determineEndpoint(params);
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const res = await fetch(`${endpoint}${qs}`, { headers });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return res.json();
}

export async function fetchMovieCredits(movieId: number): Promise<MovieCredits> {
    'use cache'
    cacheLife('days')
    cacheTag('movies', `movie-${movieId}`)
    console.log(`[cache miss] fetchMovieCredits(${movieId}) — fetching from TMDB`)
    const res = await fetch(`${API_BASE}/movie/${movieId}/credits`, { headers });
    if (!res.ok) throw new Error(`Error fetching details: ${res.status}`);
    return res.json();
}

function determineEndpoint(params: MovieSearchParams) {
    if (params.query && params.query.trim() !== "") {
        return `${API_BASE}/search/movie`;
    }
    if (params.primary_release_year || params.with_genres) {
        return `${API_BASE}/discover/movie`;
    }
    return `${API_BASE}/trending/movie/day`;
}
