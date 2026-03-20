import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('returns null when pageCount <= 1', () => {
    const { container } = render(<Pagination currentPage={1} pageCount={1} onPageChange={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('clamps currentPage and wires prev/next handlers', async () => {
    const onPageChange = vi.fn();

    render(<Pagination currentPage={3} pageCount={10} onPageChange={onPageChange} />);

    // active page
    const active = screen.getByRole('button', { name: '3' });
    expect(active).toHaveAttribute('aria-current', 'page');

    await userEvent.click(screen.getByRole('button', { name: 'Назад' }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);

    await userEvent.click(screen.getByRole('button', { name: 'Вперед' }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);

    await userEvent.click(screen.getByRole('button', { name: '5' }));
    expect(onPageChange).toHaveBeenLastCalledWith(5);
  });

  it('disables prev/next according to safeCurrentPage', () => {
    const onPageChange = vi.fn();

    const { container, rerender } = render(<Pagination currentPage={0} pageCount={3} onPageChange={onPageChange} />);
    const statusLine = container.querySelector('.statusLine');
    expect(statusLine).toHaveTextContent('Страница 1 из 3');
    expect(screen.getByRole('button', { name: 'Назад' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Вперед' })).not.toBeDisabled();

    onPageChange.mockClear();
    rerender(<Pagination currentPage={3} pageCount={3} onPageChange={onPageChange} />);
    const statusLine2 = container.querySelector('.statusLine');
    expect(statusLine2).toHaveTextContent('Страница 3 из 3');
    expect(screen.getByRole('button', { name: 'Назад' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Вперед' })).toBeDisabled();
  });
});

