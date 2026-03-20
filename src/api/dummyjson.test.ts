import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { fetchUsers, searchUsers } from './dummyjson';

const API_BASE_URL = 'https://dummyjson.com';

function mockResponse({
  ok,
  status,
  statusText,
  json,
  text,
}: {
  ok: boolean;
  status: number;
  statusText: string;
  json?: unknown;
  text?: string;
}) {
  return {
    ok,
    status,
    statusText,
    json: json !== undefined ? vi.fn().mockResolvedValue(json) : vi.fn(),
    text: text !== undefined ? vi.fn().mockResolvedValue(text) : vi.fn().mockResolvedValue(''),
  } as unknown as Response;
}

describe('dummyjson api', () => {
  const fetchSpy = vi.fn();

  beforeEach(() => {
    fetchSpy.mockReset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = fetchSpy;
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = undefined;
  });

  it('fetchUsers - ok response', async () => {
    const signal = new AbortController().signal;
    const data = { users: [{ id: 1 }], total: 1, skip: 0, limit: 10 };

    fetchSpy.mockResolvedValueOnce(mockResponse({ ok: true, status: 200, statusText: 'OK', json: data }));

    const res = await fetchUsers({ limit: 10, skip: 0, signal });

    expect(res).toEqual(data);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [url, options] = fetchSpy.mock.calls[0];
    expect(new URL(url).origin + new URL(url).pathname).toBe(API_BASE_URL + '/users');
    expect(new URL(url).searchParams.get('limit')).toBe('10');
    expect(new URL(url).searchParams.get('skip')).toBe('0');
    expect(options).toMatchObject({ signal });
  });

  it('fetchUsers - !ok response (text included)', async () => {
    fetchSpy.mockResolvedValueOnce(
      mockResponse({ ok: false, status: 500, statusText: 'Server Error', text: 'boom' }),
    );

    await expect(fetchUsers({ limit: 10, skip: 0 })).rejects.toThrow(
      'Request failed: 500 Server Error - boom',
    );
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('fetchUsers - !ok response (text throws -> empty)', async () => {
    const res = mockResponse({ ok: false, status: 404, statusText: 'Not Found', text: '' });
    (res as any).text = vi.fn().mockRejectedValue(new Error('nope'));

    fetchSpy.mockResolvedValueOnce(res);

    await expect(fetchUsers({ limit: 10, skip: 0 })).rejects.toThrow('Request failed: 404 Not Found');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('searchUsers - fallback fetch all matches', async () => {
    const signal = new AbortController().signal;

    const first = { users: [], total: 20, skip: 10, limit: 10 };
    const second = { users: [{ id: 2 }], total: 20, skip: 0, limit: 0 };

    fetchSpy
      .mockResolvedValueOnce(mockResponse({ ok: true, status: 200, statusText: 'OK', json: first }))
      .mockResolvedValueOnce(mockResponse({ ok: true, status: 200, statusText: 'OK', json: second }));

    const res = await searchUsers({ q: 'cat', limit: 10, skip: 10, signal });

    expect(res).toEqual(second);
    expect(fetchSpy).toHaveBeenCalledTimes(2);

    const [firstUrl, firstOptions] = fetchSpy.mock.calls[0];
    expect(new URL(firstUrl).pathname).toBe('/users/search');
    expect(new URL(firstUrl).searchParams.get('q')).toBe('cat');
    expect(new URL(firstUrl).searchParams.get('limit')).toBe('10');
    expect(new URL(firstUrl).searchParams.get('skip')).toBe('10');
    expect(firstOptions).toMatchObject({ signal });

    const [secondUrl, secondOptions] = fetchSpy.mock.calls[1];
    expect(new URL(secondUrl).searchParams.get('limit')).toBe('0');
    expect(new URL(secondUrl).searchParams.get('skip')).toBe('0');
    expect(secondOptions).toMatchObject({ signal });
  });

  it('searchUsers - no fallback when limit=0', async () => {
    const data = { users: [], total: 5, skip: 0, limit: 0 };
    fetchSpy.mockResolvedValueOnce(mockResponse({ ok: true, status: 200, statusText: 'OK', json: data }));

    const res = await searchUsers({ q: 'cat', limit: 0, skip: 0 });

    expect(res).toEqual(data);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});

