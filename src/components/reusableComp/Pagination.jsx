

const Pagination = ({ totalPages,currentPage,setCurrentPage }) => {
  const getPaginationRange = () => {
    if (totalPages <= 5) {
      return [...Array(totalPages).keys()].map((i) => i + 1);
    }

    if (currentPage <= 2) {
      return [1, 2, '•••', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '•••', totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '•••', currentPage, '•••', totalPages];
  };

  const handleClick = (page) => {
    if (page === '•••') return;
    setCurrentPage(page);
    // Optional: API call or data update here
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className={`flex space-x-2  items-center ${totalPages ===0 ? 'hidden' : 'block'}`}>
      {/* Prev Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="h-9 w-9 flex items-center justify-center rounded-full cursor-pointer bg-light text-lightwhite dark:bg-[#252a3a] dark:text-light disabled:opacity-40"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-arrow-left-s-line"></i>
        </div>
      </button>

      {/* Page Buttons */}
      {getPaginationRange().map((page, i) => (
        <button
          key={i}
          onClick={() => handleClick(page)}
          className={`h-9 w-9 flex items-center justify-center rounded-full text-sm cursor-pointer transition ${
            page === currentPage
              ? 'bg-primary text-lightwhite'
              : page === '...'
              ? 'text-gray-400 cursor-default'
              : 'bg-light text-lightwhite dark:bg-[#252a3a] dark:text-light'
          }`}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="h-9 w-9 flex items-center justify-center rounded-full cursor-pointer bg-light text-lightwhite dark:bg-[#252a3a] dark:text-light disabled:opacity-40"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-arrow-right-s-line"></i>
        </div>
      </button>
    </div>
  );
};

export default Pagination;
