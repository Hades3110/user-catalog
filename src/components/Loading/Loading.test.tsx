import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';

describe('Loading', () => {
  it('renders default loading text', () => {
    render(<Loading />);
    expect(screen.getByText('Идёт загрузка...')).toBeInTheDocument();
  });

  it('renders custom loading text', () => {
    render(<Loading text="Загрузка данных" />);
    expect(screen.getByText('Загрузка данных')).toBeInTheDocument();
  });
});

