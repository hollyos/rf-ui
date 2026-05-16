import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import EventHeader from './EventHeader';
import type { EventInfo } from '../../types';

const event: EventInfo = {
  name: 'RainFocus Summit',
  date: 'December 15th',
  location: 'Lehi, Utah',
  shortLocation: 'Lehi, UT',
};

describe('EventHeader', () => {
  it('renders the event name as a heading', () => {
    render(<EventHeader event={event} onEdit={() => {}} />);
    expect(screen.getByRole('heading', { name: /rainfocus summit/i })).toBeInTheDocument();
  });

  it('renders the event date and location', () => {
    render(<EventHeader event={event} onEdit={() => {}} />);
    expect(screen.getByText('December 15th')).toBeInTheDocument();
    expect(screen.getByText('Lehi, Utah')).toBeInTheDocument();
  });

  it('renders an "Edit event" button that calls onEdit when clicked', async () => {
    const onEdit = vi.fn();
    render(<EventHeader event={event} onEdit={onEdit} />);
    await userEvent.click(screen.getByRole('button', { name: /edit event/i }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
