import { describe, expect, it } from 'vitest';
import { getVisiblePages } from './utils';

describe('getVisiblePages', () => {
  it('expands window forward when start=1 and not enough visible pages', () => {
    // start=1, end=3 -> visibleCount=3 < 5, remaining=2 -> start===1 => extend end
    expect(getVisiblePages(1, 10)).toEqual([1, 2, 3, 4, 5]);
  });

  it('expands window backward when end=pageCount and not enough visible pages', () => {
    // start=8, end=10 -> visibleCount=3 < 5, remaining=2 -> end===pageCount => extend start backward
    expect(getVisiblePages(10, 10)).toEqual([6, 7, 8, 9, 10]);
  });

  it('does not expand when visibleCount reaches maxVisiblePages', () => {
    // start=2, end=6 -> visibleCount=5, visibleCount < 5 is false
    expect(getVisiblePages(4, 10)).toEqual([2, 3, 4, 5, 6]);
  });

  it('returns single page when pageCount=1', () => {
    expect(getVisiblePages(1, 1)).toEqual([1]);
  });

  it('returns all pages when pageCount < maxVisiblePages', () => {
    expect(getVisiblePages(1, 2)).toEqual([1, 2]);
    expect(getVisiblePages(2, 3)).toEqual([1, 2, 3]);
    expect(getVisiblePages(3, 4)).toEqual([1, 2, 3, 4]);
  });
});

