import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SetupGuide from './SetupGuide';

describe('SetupGuide', () => {
  it('renders the guide heading and intro copy', () => {
    render(<SetupGuide />);
    expect(screen.getByRole('heading', { name: /event setup guide/i })).toBeInTheDocument();
    expect(
      screen.getByText(/we suggest that you start with the attendee module/i),
    ).toBeInTheDocument();
  });

  it('renders the Attendee section heading', () => {
    render(<SetupGuide />);
    expect(screen.getByRole('heading', { name: /^attendee$/i })).toBeInTheDocument();
  });

  it('renders all three step labels', () => {
    render(<SetupGuide />);
    expect(screen.getByText(/Base settings\./i)).toBeInTheDocument();
    expect(screen.getByText(/Build registration workflows\./i)).toBeInTheDocument();
    expect(screen.getByText(/Design post-registration experiences\./i)).toBeInTheDocument();
  });

  it('renders three workflow cards plus an add-card', () => {
    render(<SetupGuide />);
    const titled = screen.getAllByText('Attendee Registration');
    expect(titled).toHaveLength(3);
    expect(screen.getByText(/add registration workflow/i)).toBeInTheDocument();
  });

  it('renders the Attendee Portal card', () => {
    render(<SetupGuide />);
    expect(screen.getByText(/^attendee portal$/i)).toBeInTheDocument();
  });
});
