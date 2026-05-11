type Genres = Record<string, string>;

interface FiltersProps {
    genres: Genres;
    genreFilter: string;
    yearFilter: string;
    searchQuery: string;
    onGenreChange: (value: string) => void;
    onYearChange: (value: string) => void;
    onSearchChange: (value: string) => void;
}

const filterSelectClass = "border border-[#232426] rounded-lg p-2 text-base bg-[#1A1B1D] text-white filter-select disabled:bg-[#545353] disabled:text-[#d8d7d7]";

export default function Filters({
    genres,
    genreFilter,
    yearFilter,
    searchQuery,
    onGenreChange,
    onYearChange,
    onSearchChange,
}: FiltersProps) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1887 + 1 }, (_, i) => currentYear - i);

    const isSearchActive = searchQuery.trim() !== '';

    return (
        <nav className="flex flex-col gap-4 m-4 lg:flex-row">
            <select
                name="genre"
                className={filterSelectClass}
                value={genreFilter}
                disabled={isSearchActive}
                onChange={(e) => onGenreChange(e.target.value)}
            >
                <option value="">All Genres</option>
                {Object.entries(genres).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                ))}
            </select>

            <select
                name="years"
                className={filterSelectClass}
                value={yearFilter}
                onChange={(e) => onYearChange(e.target.value)}
            >
                <option value="">All Years</option>
                {years.map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                ))}
            </select>

            <input
                type="search"
                placeholder="Search movies..."
                className={filterSelectClass}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </nav>
    );
}
