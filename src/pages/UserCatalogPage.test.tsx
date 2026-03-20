import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { DummyUser } from '../types/dummyjson';
import { UserCatalogPage } from './UserCatalogPage';

const { useUserCatalogMock } = vi.hoisted(() => ({ useUserCatalogMock: vi.fn() }));

vi.mock('../hooks/useUserCatalog', () => ({
  useUserCatalog: useUserCatalogMock,
}));

function makeUser(id: number): DummyUser {
  return {
    id,
    firstName: `First${id}`,
    lastName: `Last${id}`,
    email: `u${id}@example.com`,
    username: `user${id}`,
    image: 'https://example.com/u.png',
    age: id,
  };
}

describe('UserCatalogPage', () => {
  beforeEach(() => {
    useUserCatalogMock.mockReset();
  });

  it('shows loading status and Loading component', () => {
    useUserCatalogMock.mockReturnValue({
      draftQuery: 'E',
      setDraftQuery: vi.fn(),
      page: 1,
      onPageChange: vi.fn(),
      users: [],
      total: 0,
      pageCount: 1,
      loading: true,
      error: null,
    });

    render(<UserCatalogPage />);

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
    expect(screen.getByText('Идёт загрузка...')).toBeInTheDocument();
    expect(screen.getByLabelText('Поиск по имени')).toHaveValue('E');
  });

  it('shows error status and Error component', () => {
    useUserCatalogMock.mockReturnValue({
      draftQuery: '',
      setDraftQuery: vi.fn(),
      page: 1,
      onPageChange: vi.fn(),
      users: [],
      total: 0,
      pageCount: 1,
      loading: false,
      error: 'Не удалось загрузить',
    });

    render(<UserCatalogPage />);

    expect(screen.queryByText('Загрузка...')).toBeNull();
    expect(screen.getByText('Не удалось загрузить')).toBeInTheDocument();
    expect(screen.getByText('Ошибка: Не удалось загрузить')).toBeInTheDocument();
  });

  it('shows found total, renders user grid and pagination', () => {
    const users = [makeUser(1), makeUser(2)];

    useUserCatalogMock.mockReturnValue({
      draftQuery: 'a',
      setDraftQuery: vi.fn(),
      page: 1,
      onPageChange: vi.fn(),
      users,
      total: 7,
      pageCount: 3,
      loading: false,
      error: null,
    });

    render(<UserCatalogPage />);

    expect(screen.getByText('Найдено:')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('First1 Last1')).toBeInTheDocument();
    expect(screen.getByText('First2 Last2')).toBeInTheDocument();
    const pageStatus = screen.getByText(/Страница/).closest('.statusLine');
    expect(pageStatus).toHaveTextContent('Страница 1 из 3');
  });
});

