import type { CSSProperties } from 'react';
import styles from './Avatar.module.scss';

export interface AvatarProps {
  initials?: string;
  name?: string;
  size?: number;
}

/**
 * Avatar: a circular badge showing the user's initials. Intended for the
 * fixed bottom-left identity affordance in the layout.
 */
export default function Avatar({ initials = '?', name, size = 32 }: AvatarProps): JSX.Element {
  const inlineStyle: CSSProperties = {
    fontSize: size * 0.4,
    height: size,
    width: size,
  };
  return (
    <span
      className={styles.avatar}
      role="img"
      aria-label={name ? `${name} (${initials})` : initials}
      style={inlineStyle}
    >
      {initials.slice(0, 2).toUpperCase()}
    </span>
  );
}
