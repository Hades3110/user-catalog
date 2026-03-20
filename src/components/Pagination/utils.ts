export function getVisiblePages(currentPage: number, pageCount: number): number[] {
  const pageWindow = 2;
  const maxVisiblePages = 5;

  let start = Math.max(1, currentPage - pageWindow);
  let end = Math.min(pageCount, currentPage + pageWindow);

  const visibleCount = end - start + 1;
  if (visibleCount < maxVisiblePages) {
    const remaining = maxVisiblePages - visibleCount;

    if (start === 1) {
      end = Math.min(pageCount, end + remaining);
    } else if (end === pageCount) {
      start = Math.max(1, start - remaining);
    }
  }

  const visiblePages: number[] = [];
  for (let page = start; page <= end; page++) {
    visiblePages.push(page);
  }

  return visiblePages;
}

