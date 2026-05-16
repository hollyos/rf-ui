import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BrandRail from './BrandRail';

describe('BrandRail', () => {
  it('renders a navigation landmark labelled "Organization"', () => {
    render(<BrandRail />);
    expect(screen.getByRole('navigation', { name: /organization/i })).toBeInTheDocument();
  });

  it('renders a link to the RainFocus home', () => {
    render(<BrandRail />);
    expect(screen.getByRole('link', { name: /rainfocus home/i })).toBeInTheDocument();
  });

  it('uses the eventName prop in the event tile label', () => {
    render(<BrandRail eventName="My Conference" />);
    expect(screen.getByRole('button', { name: /my conference workspace/i })).toBeInTheDocument();
  });

  it('falls back to a sensible label when no eventName is provided', () => {
    render(<BrandRail />);
    expect(screen.getByRole('button', { name: /event workspace/i })).toBeInTheDocument();
  });
});
