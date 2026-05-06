export interface Movie {
  vote_average: number;
  overview: string;
  backdrop_path: string;
  id: number;
  title: string;
  genre_ids?: number[];
  release_date: string;
  poster_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails {
    runtime?: number;
    trailerURL?: string | null; 
    videos?: {
        results: {
            site: string;
            type: string;
            key: string;
        }[];
    };
    genres: Genre[];
    origin_country?: string;
    original_language: string;
    belongs_to_collection: Collection | null;
}

export interface Collection {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

export interface MovieSearchParams {
    query?: string;
    primary_release_year?: string | number;
    with_genres?: string | number;
    page?: number;
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path?: string | null
}

export interface MovieCredits {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}