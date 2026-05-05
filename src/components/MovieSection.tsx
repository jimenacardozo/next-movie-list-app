'use client'

import useMovies from '../hooks/useMovies'
import Filters from './Filters';
import ContentGrid from './ContentGrid';
import Pagination from './Pagination';


export default function MovieSection({ genres }: { genres: Record<number, string> }) {
  const { movies, error, currentPage, totalPages, genreFilter, yearFilter,
          searchInput, handleGenreChange, handleYearChange,
          setSearchQueryDebounced, setCurrentPage } = useMovies(genres);

  return (
    <section className="content-area">
      <Filters
        genres={genres}
        genreFilter={genreFilter}
        yearFilter={yearFilter}
        searchQuery={searchInput}
        onGenreChange={handleGenreChange}
        onYearChange={handleYearChange}
        onSearchChange={setSearchQueryDebounced}
      />
      <ContentGrid movies={movies} genres={genres} error={error} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

    </section>
  )
}
