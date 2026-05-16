import Button from '../Button/Button';
import type { EventInfo } from '../../types';
import styles from './EventHeader.module.scss';
import eventLogo from '../../assets/event-logo.png';

export interface EventHeaderProps {
  event: EventInfo;
  onEdit?: () => void;
}

/**
 * EventHeader: header strip with the event tile (rounded square thumbnail),
 * the event name, date + location stacked, and an "Edit event" CTA on the
 * trailing edge.
 */
export default function EventHeader({ event, onEdit }: EventHeaderProps): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.lead}>
        <div className={styles.thumb}>
          <img src={eventLogo} alt="" />
        </div>
        <div className={styles.text}>
          <h1 className={styles.title}>{event.name}</h1>
          <p className={styles.meta}>{event.date}</p>
          <p className={styles.meta}>{event.location}</p>
        </div>
      </div>
      <div className={styles.actions}>
        <Button variant="primary" onClick={onEdit}>
          Edit event
        </Button>
      </div>
    </header>
  );
}
