import styles from './WorkflowCard.module.scss';
import logicArrow from '../../assets/icons/logic-arrow.svg';
import addCircle from '../../assets/icons/add-circle.svg';

export type WorkflowCardVariant = 'default' | 'add';

export interface WorkflowCardProps {
  title: string;
  description?: string;
  variant?: WorkflowCardVariant;
  onClick?: () => void;
}

/**
 * WorkflowCard:
 *  - `variant="default"` (the normal card): leading arrow icon, bold
 *    title, description below. Hover lifts the card slightly.
 *  - `variant="add"` (the dashed placeholder card): centred "add" icon
 *    above the label.
 *
 * Both variants render as <button> so the whole card is keyboard
 * activatable. Visual base styles come from the shared `card-interactive`
 * mixin (see `_mixins.scss`); the `add` modifier overrides border style
 * and layout.
 */
export default function WorkflowCard({
  title,
  description,
  variant = 'default',
  onClick,
}: WorkflowCardProps): JSX.Element {
  if (variant === 'add') {
    return (
      <button type="button" className={`${styles.card} ${styles.add}`} onClick={onClick}>
        <span className={styles.addInner}>
          <img src={addCircle} alt="" width="24" height="24" className={styles.addIcon} />
          <span className={styles.addLabel}>{title}</span>
        </span>
      </button>
    );
  }

  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <div className={styles.head}>
        <img src={logicArrow} alt="" width="20" height="20" />
        <span className={styles.title}>{title}</span>
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </button>
  );
}
