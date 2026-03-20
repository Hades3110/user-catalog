import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders label and input; calls onChange on typing', async () => {
    const onChange = vi.fn();

    render(<SearchInput value="" onChange={onChange} placeholder="Тест" />);

    expect(screen.getByText('Поиск по имени')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Тест');
    expect(input).toHaveValue('');

    await userEvent.type(input, 'Em');
    expect(onChange).toHaveBeenCalled();
    // В v13 `userEvent.type` может вызывать onChange для отдельных символов.
    // Нам важно, что обработчик срабатывает и прокидывает значение из input.
    expect(onChange.mock.calls[0][0]).toBe('E');
    expect(onChange.mock.calls[onChange.mock.calls.length - 1][0]).toBe('m');
  });

  it('uses default placeholder when not provided', () => {
    const onChange = vi.fn();
    render(<SearchInput value="abc" onChange={onChange} />);

    expect(screen.getByPlaceholderText('Например, Emily')).toBeInTheDocument();
  });
});

