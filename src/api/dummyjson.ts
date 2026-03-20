import type { DummyUser, UsersListResponse } from '../types/dummyjson';

const API_BASE_URL = 'https://dummyjson.com';

function toJSON<T>(res: Response): Promise<T> {
  if (!res.ok) {
    return res
      .text()
      .catch(() => '')
      .then((text) => {
        throw new Error(`Request failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`);
      });
  }
  return res.json() as Promise<T>;
}

export type FetchUsersParams = {
  limit: number;
  skip: number;
  signal?: AbortSignal;
};

export async function fetchUsers(params: FetchUsersParams): Promise<UsersListResponse> {
  const { limit, skip, signal } = params;
  const url = new URL(`${API_BASE_URL}/users`);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('skip', String(skip));

  const res = await fetch(url.toString(), { signal });
  return toJSON<UsersListResponse<DummyUser>>(res);
}

export type SearchUsersParams = {
  q: string;
  limit: number;
  skip: number;
  signal?: AbortSignal;
};

export async function searchUsers(params: SearchUsersParams): Promise<UsersListResponse> {
  const { q, limit, skip, signal } = params;

  // For this API, `limit/skip` for `users/search` is unreliable.
  // We try the passed values, but fall back to fetching all matches.
  const url = new URL(`${API_BASE_URL}/users/search`);
  url.searchParams.set('q', q);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('skip', String(skip));

  const res = await fetch(url.toString(), { signal });
  const data = await toJSON<UsersListResponse<DummyUser>>(res);

  if (limit !== 0 && data.users.length === 0 && data.total > 0 && skip > 0) {
    // Fallback: fetch all matches and let the UI paginate client-side.
    const allUrl = new URL(`${API_BASE_URL}/users/search`);
    allUrl.searchParams.set('q', q);
    allUrl.searchParams.set('limit', '0');
    allUrl.searchParams.set('skip', '0');
    const allRes = await fetch(allUrl.toString(), { signal });
    return toJSON<UsersListResponse<DummyUser>>(allRes);
  }

  return data;
}

