import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'ghost';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * Button: a small, reusable primitive used (so far) for the "Edit event"
 * action. Variants/sizes are mapped to CSS module class names; extra
 * props (onClick, aria-*, etc.) are forwarded to the underlying <button>.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  ...rest
}: ButtonProps): JSX.Element {
  const variantClass = styles[`variant-${variant}`] ?? '';
  const sizeClass = styles[`size-${size}`] ?? '';
  return (
    <button
      type={type}
      className={`${styles.button} ${variantClass} ${sizeClass} ${className}`.trim()}
      {...rest}
    >
      {/*
        Wrap children in a span so plain-text labels passed by callers
        (e.g. <Button>Edit event</Button>) live inside a text element
        rather than sitting bare inside the <button>. Complex children
        (icon + text) still nest fine — span is a generic inline container.
      */}
      <span className={styles.label}>{children}</span>
    </button>
  );
}
