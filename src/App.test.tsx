import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

const { useUserCatalogMock } = vi.hoisted(() => ({ useUserCatalogMock: vi.fn() }));

vi.mock('./hooks/useUserCatalog', () => ({
  useUserCatalog: useUserCatalogMock,
}));

describe('App', () => {
  beforeEach(() => {
    useUserCatalogMock.mockReset();
  });

  const baseState = {
    draftQuery: '',
    setDraftQuery: vi.fn(),
    page: 1,
    onPageChange: vi.fn(),
    users: [],
    total: 0,
    pageCount: 1,
    loading: false,
    error: null,
  };

  it('renders catalog page heading', () => {
    useUserCatalogMock.mockReturnValue(baseState);
    render(<App />);
    expect(screen.getByText('Каталог пользователей')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    useUserCatalogMock.mockReturnValue({ ...baseState, loading: true });
    render(<App />);
    expect(screen.getByText('Идёт загрузка...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    useUserCatalogMock.mockReturnValue({ ...baseState, error: 'Что-то пошло не так' });
    render(<App />);
    expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();
  });
});

