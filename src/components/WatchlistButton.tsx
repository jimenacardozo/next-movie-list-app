'use client'

import { addToWatchlist, removeFromWatchlist } from "../actions/watchlist"

export default function WatchlistButton({
    movieId,
    isInWatchlist,
}: {
    movieId: number,
    isInWatchlist: boolean,
}) {
    const action = isInWatchlist ? removeFromWatchlist : addToWatchlist;
    return (
        <form action={action.bind(null, movieId)}>
            <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#232426] bg-[#1A1B1D] text-white text-sm font-medium hover:bg-[#232426] transition-colors"
            >
                {isInWatchlist ? (
                    <>
                        <span className="text-green-400 text-lg leading-none">✓</span>
                        In Watchlist
                    </>
                ): (
                    <>
                        <span className="text-lg leading-none">+</span>
                        Add to Watchlist
                    </>
                )}
            </button>
        </form>
    )
}