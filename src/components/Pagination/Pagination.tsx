import styles from './Pagination.module.css';
import { getVisiblePages } from './utils';

type PaginationProps = {
  currentPage: number;
  pageCount: number;
  onPageChange: (nextPage: number) => void;
};

export function Pagination({ currentPage, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), pageCount);
  const visiblePages = getVisiblePages(safeCurrentPage, pageCount);

  const handlePrev = () => onPageChange(safeCurrentPage - 1);
  const handleNext = () => onPageChange(safeCurrentPage + 1);

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationButtons}>
        <button
          type="button"
          className={styles.paginationButton}
          onClick={handlePrev}
          disabled={safeCurrentPage <= 1}
        >
          Назад
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            className={`${styles.pageNumberButton} ${
              page === safeCurrentPage ? styles.pageNumberButtonActive : ''
            }`}
            onClick={() => onPageChange(page)}
            aria-current={page === safeCurrentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className={`${styles.paginationButton} ${styles.paginationButtonPrimary}`}
          onClick={handleNext}
          disabled={safeCurrentPage >= pageCount}
        >
          Вперед
        </button>
      </div>
      <div className="statusLine">
        Страница <b>{safeCurrentPage}</b> из <b>{pageCount}</b>
      </div>
    </div>
  );
}

