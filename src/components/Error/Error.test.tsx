import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Error } from './Error';

describe('Error', () => {
  it('renders error message', () => {
    render(<Error message="Ошибка сети" />);
    expect(screen.getByText('Ошибка: Ошибка сети')).toBeInTheDocument();
  });
});

