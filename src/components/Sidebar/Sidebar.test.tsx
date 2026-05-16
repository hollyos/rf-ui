import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from './Sidebar';
import type { EventInfo, NavItem } from '../../types';

const event: EventInfo = {
  name: 'RainFocus Summit',
  shortLocation: 'Lehi, UT',
  date: 'December 15th',
  location: 'Lehi, Utah',
};

const navItems: NavItem[] = [
  { id: 'guide', label: 'Guide' },
  {
    id: 'attendees',
    label: 'Attendees',
    children: [
      { id: 'attendees-list', label: 'Attendees' },
      { id: 'attendee-types', label: 'Attendee types' },
    ],
  },
  { id: 'content', label: 'Content' },
];

describe('Sidebar', () => {
  it('renders the event header (title, location, date)', () => {
    render(<Sidebar event={event} navItems={navItems} activeId="attendees" />);
    // The event name in the sidebar is workspace branding, not a heading —
    // the page's h1 lives in EventHeader.
    expect(screen.getByText('RainFocus Summit')).toBeInTheDocument();
    expect(screen.getByText('Lehi, UT')).toBeInTheDocument();
    expect(screen.getByText('December 15th')).toBeInTheDocument();
  });

  it('renders all top-level nav items', () => {
    render(<Sidebar event={event} navItems={navItems} activeId="guide" />);
    expect(screen.getByRole('button', { name: /^guide$/i })).toBeInTheDocument();
    // Only the parent "Attendees" button exists when it's not active.
    expect(screen.getByRole('button', { name: /^attendees$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^content$/i })).toBeInTheDocument();
  });

  it('marks the active item with aria-current="page"', () => {
    render(<Sidebar event={event} navItems={navItems} activeId="attendees" />);
    // "Attendees" is both the parent nav button and one of the sub-items.
    // The parent is the one that carries aria-current.
    const [active] = screen.getAllByRole('button', { name: /^attendees$/i });
    expect(active).toHaveAttribute('aria-current', 'page');
  });

  it('reveals child items only under the active parent', () => {
    render(<Sidebar event={event} navItems={navItems} activeId="attendees" />);
    expect(screen.getByRole('button', { name: /attendee types/i })).toBeInTheDocument();
  });

  it('hides children when their parent is not active', () => {
    render(<Sidebar event={event} navItems={navItems} activeId="guide" />);
    expect(screen.queryByRole('button', { name: /attendee types/i })).not.toBeInTheDocument();
  });

  it('calls onSelect when a nav item is clicked', async () => {
    const onSelect = vi.fn();
    render(<Sidebar event={event} navItems={navItems} activeId="guide" onSelect={onSelect} />);
    // Guide is active, so the Attendees children are not rendered — only the
    // top-level Attendees button is present.
    await userEvent.click(screen.getByRole('button', { name: /^attendees$/i }));
    expect(onSelect).toHaveBeenCalledWith('attendees');
  });

  it('exposes a search input', () => {
    render(<Sidebar event={event} navItems={navItems} activeId="attendees" />);
    const sidebar = screen.getByRole('complementary', { name: /event navigation/i });
    expect(within(sidebar).getByRole('searchbox')).toBeInTheDocument();
  });

  // ----- Child selection (parent stays expanded) ------------------------

  it('keeps the parent section expanded when one of its children is the active item', () => {
    render(<Sidebar event={event} navItems={navItems} activeId="attendee-types" />);
    // If the parent had collapsed, this sub-item wouldn't be in the DOM.
    expect(screen.getByRole('button', { name: /attendee types/i })).toBeInTheDocument();
  });

  it('moves aria-current="page" onto the child when a child is the active item', () => {
    render(<Sidebar event={event} navItems={navItems} activeId="attendee-types" />);
    const child = screen.getByRole('button', { name: /attendee types/i });
    expect(child).toHaveAttribute('aria-current', 'page');
    // Parent button (first match for /^attendees$/i) must NOT also be aria-current
    const [parent] = screen.getAllByRole('button', { name: /^attendees$/i });
    expect(parent).not.toHaveAttribute('aria-current');
  });

  it('clicking a child calls onSelect with the child id', async () => {
    const onSelect = vi.fn();
    render(<Sidebar event={event} navItems={navItems} activeId="attendees" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /attendee types/i }));
    expect(onSelect).toHaveBeenCalledWith('attendee-types');
  });

  // ----- Disclosure semantics for screen readers -----------------------

  it('exposes aria-expanded on parent items with children', () => {
    render(<Sidebar event={event} navItems={navItems} activeId="guide" />);
    const [attendees] = screen.getAllByRole('button', { name: /^attendees$/i });
    expect(attendees).toHaveAttribute('aria-expanded', 'false');
  });

  it('flips aria-expanded to "true" when the parent is in the active path', () => {
    render(<Sidebar event={event} navItems={navItems} activeId="attendee-types" />);
    const [attendees] = screen.getAllByRole('button', { name: /^attendees$/i });
    expect(attendees).toHaveAttribute('aria-expanded', 'true');
  });

  it("wires the parent button's aria-controls to the sub-list id", () => {
    render(<Sidebar event={event} navItems={navItems} activeId="attendees" />);
    const [attendees] = screen.getAllByRole('button', { name: /^attendees$/i });
    const controls = attendees.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    expect(document.getElementById(controls as string)).not.toBeNull();
  });

  it('omits aria-expanded on items that have no children', () => {
    render(<Sidebar event={event} navItems={navItems} activeId="guide" />);
    const guide = screen.getByRole('button', { name: /^guide$/i });
    expect(guide).not.toHaveAttribute('aria-expanded');
  });
});
