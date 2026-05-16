import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import PortalCard from './PortalCard';

describe('PortalCard', () => {
  it('renders the title and description', () => {
    render(
      <PortalCard
        title="Attendee Portal"
        description="Manage the portal that attendees will see."
      />,
    );
    expect(screen.getByText('Attendee Portal')).toBeInTheDocument();
    expect(screen.getByText(/manage the portal/i)).toBeInTheDocument();
  });

  it('renders only a title when no description is provided', () => {
    render(<PortalCard title="Attendee Portal" />);
    expect(screen.getByText('Attendee Portal')).toBeInTheDocument();
  });

  it('fires onClick when activated', async () => {
    const onClick = vi.fn();
    render(<PortalCard title="Attendee Portal" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
