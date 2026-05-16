import SearchInput from '../SearchInput/SearchInput';
import type { EventInfo, NavItem } from '../../types';
import styles from './Sidebar.module.scss';

export interface SidebarProps {
  event: EventInfo;
  navItems: NavItem[];
  activeId: string;
  onSelect?: (id: string) => void;
}

/**
 * Sidebar: event title, location/date strip, search, and the main nav list.
 *
 * Nav items render with a leading circular indicator. The active item shows
 * a filled purple dot + soft purple background row, and renders its child
 * items as an indented sublist beneath it. Other items render a muted gray
 * dot.
 */
export default function Sidebar({
  event,
  navItems,
  activeId,
  onSelect = () => {},
}: SidebarProps): JSX.Element {
  return (
    <aside className={styles.sidebar} aria-label="Event navigation">
      <div className={styles.header}>
        {/*
          The event name in the sidebar is workspace/context branding,
          not a document section heading — the page's actual <h1> lives
          in EventHeader. We use a <p> (not a <div>) so the text lives
          in a semantic text element; the visible weight/size is handled
          by CSS, not by element choice.
        */}
        <p className={styles.title}>{event.name}</p>
        <p className={styles.meta}>
          <span>{event.shortLocation}</span>
          <span className={styles.dot} aria-hidden="true" />
          <span>{event.date}</span>
        </p>
      </div>

      <div className={styles.search}>
        <SearchInput placeholder="Search" />
      </div>

      <nav aria-label="Sections">
        <ul className={styles.navList}>
          {navItems.map((item) => {
            // `isItemSelected` is the *exact* active leaf: used for
            // aria-current and (at the parent level) for the parent's
            // own selected-page styling.
            const isItemSelected = item.id === activeId;

            // `isActivePath` means this item is in the currently-selected
            // subtree — either it *is* the active item, or one of its
            // children is. We use this for both:
            //   • keeping the parent visually "active" (purple background +
            //     filled indicator) when a child is selected, and
            //   • keeping the children list expanded.
            // Without this, clicking a child would collapse its parent
            // section and leave the sidebar with no visible selection.
            const childIds = item.children?.map((c) => c.id) ?? [];
            const isActivePath = isItemSelected || childIds.includes(activeId);
            const hasChildren = Boolean(item.children?.length);
            // Stable id for the sub-list, referenced by the parent
            // button's aria-controls. Disclosure pattern (WAI-ARIA APG).
            const subListId = `${item.id}-sublist`;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`${styles.navItem} ${isActivePath ? styles.navItemActive : ''}`}
                  aria-current={isItemSelected ? 'page' : undefined}
                  aria-expanded={hasChildren ? isActivePath : undefined}
                  aria-controls={hasChildren ? subListId : undefined}
                  onClick={() => onSelect(item.id)}
                >
                  <span
                    className={`${styles.indicator} ${isActivePath ? styles.indicatorActive : ''}`}
                    aria-hidden="true"
                  />
                  <span className={styles.navLabel}>{item.label}</span>
                </button>

                {isActivePath && item.children && (
                  <ul id={subListId} className={styles.subList}>
                    {item.children.map((child) => {
                      const isChildActive = child.id === activeId;
                      return (
                        <li key={child.id}>
                          <button
                            type="button"
                            className={`${styles.subItem} ${isChildActive ? styles.subItemActive : ''}`}
                            aria-current={isChildActive ? 'page' : undefined}
                            onClick={() => onSelect(child.id)}
                          >
                            <span>{child.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
