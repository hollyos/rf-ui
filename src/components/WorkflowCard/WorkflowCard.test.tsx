import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import WorkflowCard from './WorkflowCard';

describe('WorkflowCard', () => {
  it('renders the title and description in the default variant', () => {
    render(<WorkflowCard title="Attendee Registration" description="Start by creating one" />);
    expect(screen.getByText('Attendee Registration')).toBeInTheDocument();
    expect(screen.getByText('Start by creating one')).toBeInTheDocument();
  });

  it('omits the description if none is provided', () => {
    render(<WorkflowCard title="Attendee Registration" />);
    expect(screen.getByText('Attendee Registration')).toBeInTheDocument();
    // No <p> rendered when description is not passed
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('renders the add variant centred without a description', () => {
    render(<WorkflowCard variant="add" title="Add Registration Workflow" />);
    expect(screen.getByRole('button', { name: /add registration workflow/i })).toBeInTheDocument();
  });

  it('fires onClick when activated', async () => {
    const onClick = vi.fn();
    render(<WorkflowCard title="x" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is a button element (so the whole card is keyboard activatable)', () => {
    render(<WorkflowCard title="x" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});
