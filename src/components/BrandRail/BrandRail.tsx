import styles from './BrandRail.module.scss';
import rfLogo from '../../assets/icons/rf-logo.svg';
import eventLogo from '../../assets/event-logo.png';

export interface BrandRailProps {
  /** Name of the current event, used to build the event-tile aria-label. */
  eventName?: string;
}

/**
 * BrandRail: the ultra-narrow column on the far left containing the
 * RainFocus brand mark and the current event's tile-style logo.
 *
 * The rail is a navigation landmark — both items are buttons because in a
 * real product they would switch context (back to org level, switch event).
 */
export default function BrandRail({ eventName = 'Event' }: BrandRailProps): JSX.Element {
  return (
    <nav className={styles.rail} aria-label="Organization">
      <a className={styles.brand} href="#" aria-label="RainFocus home">
        <img src={rfLogo} alt="" width="32" height="42" />
      </a>
      <button type="button" className={styles.eventTile} aria-label={`${eventName} workspace`}>
        <img src={eventLogo} alt="" width="32" height="32" />
      </button>
    </nav>
  );
}
