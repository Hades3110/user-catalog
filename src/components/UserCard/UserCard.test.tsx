import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserCard } from './UserCard';
import type { DummyUser } from '../../types/dummyjson';

describe('UserCard', () => {
  it('renders full name and includes age when it is a number', () => {
    const user: DummyUser = {
      id: 1,
      firstName: ' John ',
      lastName: ' Doe ',
      email: 'john@example.com',
      username: 'johnd',
      image: 'https://example.com/john.png',
      age: 30,
    };

    render(<UserCard user={user} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('@johnd • 30')).toBeInTheDocument();
    const img = screen.getByRole('img', { name: 'John Doe' });
    expect(img).toHaveAttribute('src', user.image);
  });

  it('does not append age when it is missing', () => {
    const user: DummyUser = {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      username: 'jane_s',
      image: 'https://example.com/jane.png',
    };

    render(<UserCard user={user} />);

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('@jane_s')).toBeInTheDocument();
    expect(screen.queryByText(/•\s*\d+/)).toBeNull();
  });
});

