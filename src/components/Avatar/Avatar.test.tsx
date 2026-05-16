import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Avatar from './Avatar';

describe('Avatar', () => {
  it('renders the initials', () => {
    render(<Avatar initials="FL" />);
    expect(screen.getByText('FL')).toBeInTheDocument();
  });

  it('uppercases lower-case initials', () => {
    render(<Avatar initials="fl" />);
    expect(screen.getByText('FL')).toBeInTheDocument();
  });

  it('truncates more than two characters', () => {
    render(<Avatar initials="FLM" />);
    expect(screen.getByText('FL')).toBeInTheDocument();
  });

  it('includes the user name in the accessible label when provided', () => {
    render(<Avatar initials="FL" name="Faye Loring" />);
    expect(screen.getByLabelText(/faye loring/i)).toBeInTheDocument();
  });
});
