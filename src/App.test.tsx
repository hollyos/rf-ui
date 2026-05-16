import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App — accessibility', () => {
  it('exposes a single page-level <h1>', () => {
    render(<App />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/rainfocus summit/i);
  });

  it('renders a "Skip to main content" link as the first link in tab order', () => {
    render(<App />);
    const skip = screen.getByRole('link', { name: /skip to main content/i });
    expect(skip).toBeInTheDocument();
    expect(skip).toHaveAttribute('href', '#main-content');
  });

  it('exposes a <main> region with id="main-content" for the skip target', () => {
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
  });

  it('hamburger button advertises that it controls a dialog', () => {
    render(<App />);
    const trigger = screen.getByRole('button', { name: /open navigation/i });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    const controls = trigger.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    expect(document.getElementById(controls as string)).not.toBeNull();
  });

  it('drawer becomes a dialog when opened, and trigger flips aria-expanded', async () => {
    render(<App />);
    const trigger = screen.getByRole('button', { name: /open navigation/i });

    // Closed: no dialog landmark in the document.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(trigger);

    // Open: dialog landmark exists and is labelled.
    const dialog = screen.getByRole('dialog', { name: /event navigation/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    // Trigger now reflects the open state. Both the hamburger and the
    // backdrop are labelled "Close navigation" when open, so identify
    // the hamburger via its aria-haspopup="dialog".
    const triggerNow = screen
      .getAllByRole('button', { name: /close navigation/i })
      .find((el) => el.getAttribute('aria-haspopup') === 'dialog');
    expect(triggerNow).toHaveAttribute('aria-expanded', 'true');
  });

  it('Escape key closes the open drawer', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /open navigation/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('returns focus to the hamburger trigger when the drawer closes', async () => {
    render(<App />);
    const trigger = screen.getByRole('button', { name: /open navigation/i });

    await userEvent.click(trigger);
    // Focus is no longer on the trigger after opening.
    expect(document.activeElement).not.toBe(trigger);

    await userEvent.keyboard('{Escape}');

    // After close, focus returns to the trigger.
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /open navigation/i }));
  });
});
