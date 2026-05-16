import type { BaseSettingItem } from '../../types';
import styles from './BaseSettingsCard.module.scss';

export interface BaseSettingsCardProps {
  items?: BaseSettingItem[];
}

/**
 * BaseSettingsCard: a single bordered card that lays out a row of titled
 * description blocks. Each item has a bold title and one or two lines of
 * supporting text. The first item is visually a "lead" cell (slightly
 * narrower) but uses the same markup.
 */
export default function BaseSettingsCard({ items = [] }: BaseSettingsCardProps): JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.id} className={styles.cell}>
            <h4 className={styles.title}>{item.title}</h4>
            <p className={styles.description}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
