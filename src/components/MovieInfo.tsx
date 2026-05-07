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

      {cast.length > 0 && (
        <div>
          <h2 className="text-white text-xl font-semibold mb-4">Cast</h2>
          <div className="grid grid-cols-5 gap-4">
            {cast.map((member: CastMember) => (
              <div key={member.id} className="flex flex-col items-center gap-2">
                {member.profile_path ? (
                  <Image
                    src={`${TMDB_IMAGE_BASE}${member.profile_path}`}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="rounded-full object-cover border border-[#232426] w-24 h-24"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border border-[#232426] bg-[#1A1B1D] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[#4a4a4d]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  </div>
                )}
                <span className="text-white text-sm text-center font-medium leading-tight">{member.name}</span>
                <span className="text-[#7d7d7f] text-xs text-center leading-tight">{member.character}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
