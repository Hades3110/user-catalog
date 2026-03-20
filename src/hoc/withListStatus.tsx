import type { ComponentType } from 'react';
import { Error as CatalogError } from '../components/Error/Error';
import { Loading } from '../components/Loading/Loading';

export type WithListStatusProps<TItem> = {
  items: TItem[];
  loading: boolean;
  error: string | null;
  emptyText?: string;
};

export function withListStatus<TItem, TExtraProps extends object>(
  Wrapped: ComponentType<TExtraProps & { items: TItem[] }>
) {
  return function WithListStatus(props: TExtraProps & WithListStatusProps<TItem>) {
    const { items, loading, error, emptyText, ...rest } = props;

    if (error) {
      return <CatalogError message={error} />;
    }

    if (loading && items.length === 0) {
      return <Loading />;
    }

    if (!loading && items.length === 0) {
      return <div className="center">{emptyText ?? 'Пользователи не найдены'}</div>;
    }

    return <Wrapped {...(rest as TExtraProps)} items={items} />;
  };
}

