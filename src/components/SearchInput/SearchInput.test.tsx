import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchInput from './SearchInput';

describe('SearchInput', () => {
  it('renders a searchbox', () => {
    render(<SearchInput />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('uses the placeholder prop', () => {
    render(<SearchInput placeholder="Find events" />);
    expect(screen.getByPlaceholderText('Find events')).toBeInTheDocument();
  });

  it('calls onChange when the user types', async () => {
    const onChange = vi.fn();
    render(<SearchInput onChange={onChange} />);
    await userEvent.type(screen.getByRole('searchbox'), 'hi');
    expect(onChange).toHaveBeenCalled();
  });

  it('respects a custom aria-label', () => {
    render(<SearchInput placeholder="Search" ariaLabel="Search attendees" />);
    expect(screen.getByLabelText('Search attendees')).toBeInTheDocument();
  });
});
