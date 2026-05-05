import { useState, useEffect, useCallback, useRef, SetStateAction } from 'react';
import { fetchMovies, fetchGenres } from '../movieService';
import { Movie, MovieSearchParams } from '../types/movie';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface UseMoviesFilters {
  genreFilter: string;
  yearFilter: string;
  searchQuery: string;
}

export default function useMovies() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const genreFromURL = searchParams.get('genre') || 'all';
  const yearFromURL = searchParams.get('year') || 'all';
  const queryFromURL = searchParams.get('query') || '';

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Record<number, string>>({});
  const [genreFilter, setGenreFilter] = useState(genreFromURL);
  const [yearFilter, setYearFilter] = useState(yearFromURL);
  const [searchQuery, setSearchQuery] = useState(queryFromURL);
  const [searchInput, setSearchInput] = useState(queryFromURL);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [genreFilter, yearFilter, searchQuery]);

  useEffect(() => {
    fetchGenres()
      .then(g => {
        setGenres(g);
      })
      .catch(err => setError(err.message));
  }, [currentPage, genreFilter, yearFilter, searchQuery]);

  const buildParams = useCallback(() => {
    const params: MovieSearchParams = {};
    if (searchQuery.trim()) {
      params.query = searchQuery.trim();
    } else {
      if (genreFilter !== 'all') {
        params.with_genres = genreFilter;
      }
      if (yearFilter !== 'all') {
        params.primary_release_year = yearFilter;
      }
      if (currentPage > 1) {
        params.page = currentPage;
      }
    }
    return params;
  }, [genreFilter, yearFilter, searchQuery, currentPage]);

    useEffect(() => {
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.set('query', searchQuery.trim());
      } else {
        if (genreFilter !== 'all') params.set('genre', genreFilter);
        if (yearFilter !== 'all') params.set('year', yearFilter);
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, [genreFilter, yearFilter, searchQuery, pathname, router]);

  useEffect(() => {
    setGenreFilter(genreFromURL);
    setYearFilter(yearFromURL);
    setSearchQuery(queryFromURL);
    setSearchInput(queryFromURL);
  }, [genreFromURL, yearFromURL, queryFromURL]);

  useEffect(() => {
    setError(null);
    fetchMovies(buildParams())
      .then(data => {
        setMovies(data.results);
        setTotalPages(data.total_pages);
      })
      .catch(err => setError(err.message));    
  }, [buildParams]);


  const handleGenreChange = (genreId: string) => {
    setGenreFilter(genreId);
  };

  const handleYearChange = (year: string) => {
    setYearFilter(year);
  };

  const setSearchQueryDebounced = useCallback((value: SetStateAction<string>) => {
      setSearchInput(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setCurrentPage(1);
            setSearchQuery(value);
        }, 500);
    }, []);

  return {
    movies,
    genres,
    error,
    currentPage,
    totalPages,
    genreFilter,
    yearFilter,
    searchQuery,
    searchInput,
    handleGenreChange,
    handleYearChange,
    setSearchQueryDebounced,
    setCurrentPage
  };
}
