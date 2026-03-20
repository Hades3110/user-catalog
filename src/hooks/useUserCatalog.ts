import { useEffect, useMemo, useState } from 'react';
import type { DummyUser } from '../types/dummyjson';
import { fetchUsers, searchUsers } from '../api/dummyjson';

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError';
}

export type UseUserCatalogResult = {
  draftQuery: string;
  setDraftQuery: (next: string) => void;
  page: number;
  onPageChange: (nextPage: number) => void;
  users: DummyUser[];
  total: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
};

export function useUserCatalog(): UseUserCatalogResult {
  const [draftQuery, setDraftQueryState] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState<DummyUser[]>([]);
  const [total, setTotal] = useState(0);
  const [allSearchUsers, setAllSearchUsers] = useState<DummyUser[] | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const next = draftQuery.trim();
    const t = window.setTimeout(() => {
      setQuery(next);
      setPage(1);
      setAllSearchUsers(null);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(t);
  }, [draftQuery]);

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      setError(null);

      try {
        if (!query) {
          setLoading(true);
          const res = await fetchUsers({
            limit: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
            signal: controller.signal,
          });
          setUsers(res.users);
          setTotal(res.total);
          setAllSearchUsers(null);
          return;
        }

        if (allSearchUsers) {
          const start = (page - 1) * PAGE_SIZE;
          setUsers(allSearchUsers.slice(start, start + PAGE_SIZE));
          setLoading(false);
          return;
        }

        setLoading(true);
        const res = await searchUsers({
          q: query,
          limit: 0,
          skip: 0,
          signal: controller.signal,
        });

        setAllSearchUsers(res.users);
        setTotal(res.total);

        const start = (page - 1) * PAGE_SIZE;
        setUsers(res.users.slice(start, start + PAGE_SIZE));
      } catch (err) {
        if (isAbortError(err)) return;
        setError(err instanceof Error ? err.message : 'Не удалось загрузить пользователей');
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [query, page, allSearchUsers]);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  return {
    draftQuery,
    setDraftQuery: (next) => setDraftQueryState(next),
    page,
    onPageChange: (nextPage) => setPage(nextPage),
    users,
    total,
    pageCount,
    loading,
    error,
  };
}
