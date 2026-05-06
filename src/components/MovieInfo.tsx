import Image from 'next/image';
import { MovieDetails, MovieCredits, CastMember } from '../types/movie';

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English', es: 'Spanish', fr: 'French', de: 'German',
  it: 'Italian', pt: 'Portuguese', ja: 'Japanese', ko: 'Korean',
  zh: 'Chinese', ru: 'Russian', hi: 'Hindi', ar: 'Arabic',
};

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', GB: 'United Kingdom', FR: 'France', DE: 'Germany',
  IT: 'Italy', ES: 'Spain', JP: 'Japan', KR: 'South Korea', CN: 'China',
  IN: 'India', BR: 'Brazil', AU: 'Australia', CA: 'Canada', MX: 'Mexico', AR: 'Argentina',
};

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w185';

export default function MovieInfo({ movie, credits }: { movie: MovieDetails; credits: MovieCredits }) {
  const country = movie.origin_country?.[0];
  const countryName = country ? (COUNTRY_NAMES[country] ?? country) : null;
  const languageName = LANGUAGE_NAMES[movie.original_language] ?? movie.original_language.toUpperCase();
  const collection = movie.belongs_to_collection;
  const cast = credits.cast.slice(0, 10);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-8">

      {/* Metadata pills */}
      <div className="flex flex-wrap gap-3">
        {countryName && (
          <span className="flex items-center gap-2 bg-[#1A1B1D] border border-[#232426] rounded-full px-4 py-1.5 text-sm text-[#d1d1d3]">
            <span className="text-[#7d7d7f] text-xs">Country</span>
            {countryName}
          </span>
        )}
        <span className="flex items-center gap-2 bg-[#1A1B1D] border border-[#232426] rounded-full px-4 py-1.5 text-sm text-[#d1d1d3]">
          <span className="text-[#7d7d7f] text-xs">Language</span>
          {languageName}
        </span>
        {collection && (
          <span className="flex items-center gap-2 bg-[#1A1B1D] border border-[#232426] rounded-full px-4 py-1.5 text-sm text-[#d1d1d3]">
            <span className="text-[#7d7d7f] text-xs">Collection</span>
            {collection.name}
          </span>
        )}
      </div>

      {/* Cast */}
      {cast.length > 0 && (
        <div>
          <h2 className="text-white text-xl font-semibold mb-4">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cast.map((member: CastMember) => (
              <div key={member.id} className="flex flex-col items-center gap-1.5 min-w-[80px]">
                <Image
                  src={member.profile_path ? `${TMDB_IMAGE_BASE}${member.profile_path}` : '/icono-perfil.avif'}
                  alt={member.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover border border-[#232426] w-16 h-16"
                  unoptimized={!member.profile_path}
                />
                <span className="text-white text-xs text-center font-medium leading-tight">{member.name}</span>
                <span className="text-[#7d7d7f] text-[11px] text-center leading-tight">{member.character}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
