import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUserCatalog } from './useUserCatalog';
import type { DummyUser, UsersListResponse } from '../types/dummyjson';

const { fetchUsersMock, searchUsersMock } = vi.hoisted(() => ({
  fetchUsersMock: vi.fn(),
  searchUsersMock: vi.fn(),
}));

vi.mock('../api/dummyjson', () => ({
  fetchUsers: fetchUsersMock,
  searchUsers: searchUsersMock,
}));

function makeUsers(count: number, offset = 0): DummyUser[] {
  return Array.from({ length: count }, (_, i) => {
    const id = offset + i + 1;
    return {
      id,
      firstName: `First${id}`,
      lastName: `Last${id}`,
      email: `user${id}@example.com`,
      username: `user${id}`,
      image: `https://example.com/u${id}.png`,
    };
  });
}

describe('useUserCatalog', () => {
  beforeEach(() => {
    fetchUsersMock.mockReset();
    searchUsersMock.mockReset();
    vi.useRealTimers();
  });

  it('loads users with fetchUsers when query is empty', async () => {
    fetchUsersMock.mockResolvedValueOnce({
      users: makeUsers(2),
      total: 0,
      skip: 0,
      limit: 10,
    } satisfies UsersListResponse<DummyUser>);

    const { result } = renderHook(() => useUserCatalog());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchUsersMock).toHaveBeenCalledTimes(1);
    expect(fetchUsersMock).toHaveBeenCalledWith({
      limit: 10,
      skip: 0,
      signal: expect.any(AbortSignal),
    });
    expect(result.current.users).toHaveLength(2);
    expect(result.current.total).toBe(0);
    expect(result.current.pageCount).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('debounces draftQuery, trims input, and calls searchUsers', async () => {
    vi.useFakeTimers();

    fetchUsersMock.mockResolvedValueOnce({
      users: makeUsers(1),
      total: 0,
      skip: 0,
      limit: 10,
    } satisfies UsersListResponse<DummyUser>);

    const allUsers = makeUsers(15);
    const searchRes = {
      users: allUsers,
      total: 15,
      skip: 0,
      limit: 0,
    } satisfies UsersListResponse<DummyUser>;

    searchUsersMock.mockResolvedValueOnce(searchRes);

    const { result } = renderHook(() => useUserCatalog());
    await act(async () => {
      await Promise.resolve();
    });
    expect(fetchUsersMock).toHaveBeenCalledTimes(1);
    await act(async () => {
      await fetchUsersMock.mock.results[0]!.value;
    });
    expect(result.current.loading).toBe(false);

    // debounce + trim
    await act(async () => {
      result.current.setDraftQuery('  Emily  ');
    });
    // Дадим React-эффекту debounce успеть запланировать setTimeout
    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(searchUsersMock).toHaveBeenCalledTimes(1);
    await act(async () => {
      await searchUsersMock.mock.results[0]!.value;
    });

    expect(result.current.loading).toBe(false);

    expect(searchUsersMock).toHaveBeenCalledWith({
      q: 'Emily',
      limit: 0,
      skip: 0,
      signal: expect.any(AbortSignal),
    });

    // page=1 => first PAGE_SIZE users
    expect(result.current.users).toHaveLength(10);
    expect(result.current.total).toBe(15);
    expect(result.current.pageCount).toBe(2);
    expect(result.current.error).toBeNull();
  });

  it('uses cached allSearchUsers to paginate without additional searchUsers calls', async () => {
    vi.useFakeTimers();

    fetchUsersMock.mockResolvedValueOnce({
      users: makeUsers(1),
      total: 0,
      skip: 0,
      limit: 10,
    } satisfies UsersListResponse<DummyUser>);

    const allUsers = makeUsers(15);
    searchUsersMock.mockResolvedValueOnce({
      users: allUsers,
      total: 15,
      skip: 0,
      limit: 0,
    } satisfies UsersListResponse<DummyUser>);

    const { result } = renderHook(() => useUserCatalog());
    await act(async () => {
      await Promise.resolve();
    });
    expect(fetchUsersMock).toHaveBeenCalledTimes(1);
    await act(async () => {
      await fetchUsersMock.mock.results[0]!.value;
    });
    expect(result.current.loading).toBe(false);

    await act(async () => {
      result.current.setDraftQuery('qwerty');
    });
    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(searchUsersMock).toHaveBeenCalledTimes(1);
    await act(async () => {
      await searchUsersMock.mock.results[0]!.value;
    });
    expect(result.current.loading).toBe(false);

    await act(async () => {
      result.current.onPageChange(2);
    });

    expect(searchUsersMock).toHaveBeenCalledTimes(1);
    // page=2 => slice from index 10 .. 19 (10..)
    expect(result.current.users.map((u) => u.id)).toEqual(allUsers.slice(10, 20).map((u) => u.id));
  });

  it('does not set error when fetchUsers rejects with AbortError', async () => {
    fetchUsersMock.mockRejectedValueOnce(new DOMException('aborted', 'AbortError'));

    const { result } = renderHook(() => useUserCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
  });

  it('sets error message when fetchUsers throws Error', async () => {
    fetchUsersMock.mockRejectedValueOnce(new Error('Boom message'));

    const { result } = renderHook(() => useUserCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Boom message');
  });

  it('sets default error message when fetchUsers throws non-Error value', async () => {
    fetchUsersMock.mockRejectedValueOnce('oops' as any);

    const { result } = renderHook(() => useUserCatalog());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Не удалось загрузить пользователей');
  });
});

