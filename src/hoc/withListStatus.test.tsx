import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { DummyUser } from '../types/dummyjson';
import { withListStatus } from './withListStatus';

function Wrapped({ items, label }: { items: DummyUser[]; label: string }) {
  return <div>wrapped:{label}:{items.length}</div>;
}

const EnhancedWrapped = withListStatus<DummyUser, { label: string }>(Wrapped);

describe('withListStatus', () => {
  it('renders Error when error is set', () => {
    render(<EnhancedWrapped items={[]} loading={false} error="Сбой сети" label="L" />);
    expect(screen.getByText('Ошибка: Сбой сети')).toBeInTheDocument();
  });

  it('renders Loading when loading=true and items is empty', () => {
    render(<EnhancedWrapped items={[]} loading={true} error={null} label="L" />);
    expect(screen.getByText('Идёт загрузка...')).toBeInTheDocument();
  });

  it('renders emptyText when !loading and items is empty (custom)', () => {
    render(<EnhancedWrapped items={[]} loading={false} error={null} emptyText="Пусто" label="L" />);
    expect(screen.getByText('Пусто')).toBeInTheDocument();
  });

  it('renders default emptyText when !loading and items is empty', () => {
    render(<EnhancedWrapped items={[]} loading={false} error={null} label="L" />);
    expect(screen.getByText('Пользователи не найдены')).toBeInTheDocument();
  });

  it('renders wrapped component when items are not empty', () => {
    render(
      <EnhancedWrapped
        items={[{ id: 1, firstName: 'A', lastName: 'B', email: 'a@b', username: 'ab', image: '' }]}
        loading={false}
        error={null}
        label="LBL"
      />,
    );
    expect(screen.getByText('wrapped:LBL:1')).toBeInTheDocument();
  });
});

