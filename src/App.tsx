import { useEffect, useRef, useState } from 'react';
import BrandRail from './components/BrandRail/BrandRail';
import Sidebar from './components/Sidebar/Sidebar';
import EventHeader from './components/EventHeader/EventHeader';
import SetupGuide from './components/SetupGuide/SetupGuide';
import Avatar from './components/Avatar/Avatar';
import type { EventInfo, NavItem } from './types';
import styles from './App.module.scss';

// Static navigation data. Lives at the top of the tree so the active item
// is a single source of truth.
const NAV_ITEMS: NavItem[] = [
  { id: 'guide', label: 'Guide' },
  {
    id: 'attendees',
    label: 'Attendees',
    children: [
      { id: 'attendees-list', label: 'Attendees' },
      { id: 'attendee-types', label: 'Attendee types' },
      { id: 'packages', label: 'Packages' },
      { id: 'reg-codes', label: 'Reg codes' },
      { id: 'discounts', label: 'Discounts' },
    ],
  },
  { id: 'content', label: 'Content' },
  { id: 'exhibitors', label: 'Exhibitors' },
];

const EVENT: EventInfo = {
  name: 'RainFocus Summit',
  date: 'December 15th',
  location: 'Lehi, Utah',
  shortLocation: 'Lehi, UT',
};

// Stable id for the mobile drawer — referenced by the hamburger's
// aria-controls and used as the dialog's anchor id.
const DRAWER_ID = 'event-nav-drawer';

export default function App(): JSX.Element {
  const [activeNav, setActiveNav] = useState<string>('attendees');
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Refs for focus management. On mobile, the drawer behaves as a modal
  // dialog: opening it moves focus into the drawer, closing it returns
  // focus to the trigger (the hamburger button).
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef<boolean>(false);

  const handleSelect = (id: string): void => {
    setActiveNav(id);
    setSidebarOpen(false);
  };

  // When the drawer opens:
  //   • Move focus to the drawer container (programmatic focus via
  //     tabIndex={-1}). The user can then Tab into the nav items.
  //   • Bind Escape to close.
  // When it closes (any reason — Esc, backdrop, nav-select), focus
  // returns to the hamburger button so keyboard users aren't lost.
  useEffect(() => {
    if (!isSidebarOpen) return;

    // Defer focus by a microtask so the drawer is rendered/visible before
    // we focus it (otherwise focus may bounce off the still-hidden node).
    const t = window.setTimeout(() => {
      drawerRef.current?.focus();
    }, 0);

    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [isSidebarOpen]);

  // Return focus to the trigger when the drawer transitions from open
  // to closed. Guarded so the initial render doesn't yank focus.
  useEffect(() => {
    if (wasOpenRef.current && !isSidebarOpen) {
      hamburgerRef.current?.focus();
    }
    wasOpenRef.current = isSidebarOpen;
  }, [isSidebarOpen]);

  return (
    <div className={styles.app}>
      {/* Skip link: hidden until focused. Lets keyboard users jump past
          the rail/sidebar straight to the main content. WCAG 2.4.1. */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      {/* Mobile-only top bar with the drawer trigger. Hidden on desktop. */}
      <header className={styles.mobileTopBar}>
        <button
          ref={hamburgerRef}
          type="button"
          className={styles.menuButton}
          aria-label={isSidebarOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isSidebarOpen}
          aria-haspopup="dialog"
          aria-controls={DRAWER_ID}
          onClick={() => setSidebarOpen((v) => !v)}
        >
          <span className={styles.menuIcon} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        <span className={styles.mobileTitle}>{EVENT.name}</span>
      </header>

      {/* Left rail (brand + sidebar). On desktop it's a permanent
          column. On mobile it becomes an off-canvas dialog when open. */}
      <div
        ref={drawerRef}
        id={DRAWER_ID}
        data-testid="left-rail"
        tabIndex={-1}
        className={`${styles.leftRail} ${isSidebarOpen ? styles.leftRailOpen : ''}`}
        role={isSidebarOpen ? 'dialog' : undefined}
        aria-modal={isSidebarOpen || undefined}
        aria-label={isSidebarOpen ? 'Event navigation' : undefined}
      >
        <BrandRail eventName={EVENT.name} />
        <Sidebar event={EVENT} navItems={NAV_ITEMS} activeId={activeNav} onSelect={handleSelect} />
      </div>

      {/* Backdrop closes the mobile drawer when tapped. */}
      <button
        type="button"
        aria-label="Close navigation"
        tabIndex={isSidebarOpen ? 0 : -1}
        className={`${styles.backdrop} ${isSidebarOpen ? styles.backdropVisible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <main id="main-content" tabIndex={-1} className={styles.main}>
        <EventHeader event={EVENT} onEdit={() => {}} />
        <SetupGuide />
      </main>

      <div className={styles.userAvatar}>
        <Avatar initials="FL" />
      </div>
    </div>
  );
}
