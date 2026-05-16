import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BaseSettingsCard from './BaseSettingsCard';
import type { BaseSettingItem } from '../../types';

const items: BaseSettingItem[] = [
  { id: 'a', title: 'General', description: 'Define Attendee types & attributes' },
  { id: 'b', title: 'Title', description: 'Description that explains the value.' },
  { id: 'c', title: 'Title', description: 'Description that explains the value.' },
];

describe('BaseSettingsCard', () => {
  it('renders one cell per item', () => {
    render(<BaseSettingsCard items={items} />);
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getAllByText('Title')).toHaveLength(2);
  });

  it('renders each description', () => {
    render(<BaseSettingsCard items={items} />);
    expect(screen.getByText(/define attendee types & attributes/i)).toBeInTheDocument();
    expect(screen.getAllByText(/description that explains the value/i)).toHaveLength(2);
  });

  it('renders nothing extra when given an empty list', () => {
    const { container } = render(<BaseSettingsCard items={[]} />);
    // The wrapper still renders, but the grid contains no cell headings
    expect(container.querySelectorAll('h4')).toHaveLength(0);
  });
});
