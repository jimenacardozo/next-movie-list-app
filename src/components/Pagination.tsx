const pageSelectorBase = "px-[0.7rem] py-[0.2rem] text-[0.9rem] text-white flex self-center";
const selectedBorder = "border-2 border-[#222325] rounded-[5px]";

export default function Pagination({currentPage, totalPages, onPageChange}: {currentPage: number, totalPages: number, onPageChange: (page: number) => void}) {
    const isLast: boolean = currentPage === totalPages;
    const isFirst: boolean = currentPage === 1;
    const nextPage = Math.min(currentPage + 1, totalPages);
    return (
        <div className="px-[0.7rem] py-[0.2rem] text-[0.9rem] text-white flex self-center" id="page-selector">
            <button
                className="text-white text-[0.9rem] border-none bg-[#060709] cursor-pointer disabled:cursor-default disabled:text-[#7d7d7f]"
                disabled={isFirst}
                id="previous-page-button"
                onClick={() => onPageChange(currentPage - 1)}>
                &lt; Previous
            </button>
            <span className={`${pageSelectorBase} ${!isLast ? selectedBorder : ''}`}>
                {currentPage}
            </span>
            <span className={`${pageSelectorBase} ${isLast ? selectedBorder : ''}`}>
                {nextPage}
            </span>
            <button
                className="text-white text-[0.9rem] border-none bg-[#060709] cursor-pointer disabled:cursor-default disabled:text-[#7d7d7f]"
                id="next-page-button"
                disabled={isLast}
                onClick={() => onPageChange(nextPage)}>
                Next &gt;
            </button>
        </div>
    );
}
