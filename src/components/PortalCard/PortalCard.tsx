import styles from './PortalCard.module.scss';
import computer from '../../assets/icons/computer.svg';

export interface PortalCardProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

/**
 * PortalCard: a single bordered card with a leading monitor icon, bold
 * title, and a description. Used in the post-registration experiences
 * step. Visual base styles come from the shared `card-interactive`
 * mixin so this stays in lockstep with WorkflowCard.
 */
export default function PortalCard({ title, description, onClick }: PortalCardProps): JSX.Element {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <div className={styles.head}>
        <img src={computer} alt="" width="20" height="20" />
        <span className={styles.title}>{title}</span>
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </button>
  );
}
