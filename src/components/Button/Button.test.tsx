import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Edit event</Button>);
    expect(screen.getByRole('button', { name: /edit event/i })).toBeInTheDocument();
  });

  it('defaults to type="button" to avoid accidental form submission', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('fires onClick when activated', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards extra props (e.g., aria-label) to the DOM node', () => {
    render(<Button aria-label="save">x</Button>);
    expect(screen.getByLabelText('save')).toBeInTheDocument();
  });

  it('respects disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Off
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
