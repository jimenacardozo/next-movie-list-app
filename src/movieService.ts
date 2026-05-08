import { CONFIG } from "./config";
import { Genre, MovieCredits, MovieDetails, MovieSearchParams } from "./types/movie";

const API_BASE = "https://api.themoviedb.org/3";

const headers = {
    accept: "application/json",
    Authorization: `Bearer ${CONFIG.API_KEY}`,
};

const FETCH_OPTIONS: RequestInit & {
  next: { revalidate: number }
} = {
  headers,
  next: {
    revalidate: 86400,
  },
};

const TRENDING_FETCH_OPTIONS: RequestInit & {
  next: { revalidate: number }
} = {
  headers,
  next: {
    revalidate: 3600,
  },
};

export async function fetchTrendingMovies() {
    const res = await fetch(`${API_BASE}/trending/movie/day`, TRENDING_FETCH_OPTIONS);
    if (!res.ok) throw new Error(`Error fetching trending: ${res.status}`);
    return res.json();
}

export async function fetchMovieDetails(movieId: number): Promise<MovieDetails> {
    const res = await fetch(`${API_BASE}/movie/${movieId}`, FETCH_OPTIONS);
    if (!res.ok) throw new Error(`Error fetching details: ${res.status}`);
    return res.json();
}

export async function fetchMovieVideos(movieId: number) {
    const res = await fetch(`${API_BASE}/movie/${movieId}/videos`, FETCH_OPTIONS);
    if (!res.ok) throw new Error(`Error fetching videos: ${res.status}`);
    return res.json();
}

export async function fetchGenres() {
    const res = await fetch(`${API_BASE}/genre/movie/list`, FETCH_OPTIONS);
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
    const res = await fetch(`${API_BASE}/movie/${movieId}/credits`, FETCH_OPTIONS);
    if (!res.ok) throw new Error(`Error fetching details: ${res.status}`);
    return res.json();
}

export function determineEndpoint(params: MovieSearchParams) {
    if (params.query && params.query.trim() !== "") {
        return `${API_BASE}/search/movie`;
    }
    if (params.primary_release_year || params.with_genres) {
        return `${API_BASE}/discover/movie`;
    }
    return `${API_BASE}/trending/movie/day`;
}
