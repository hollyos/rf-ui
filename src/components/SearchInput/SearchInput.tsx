import { useId, type ChangeEvent } from 'react';
import styles from './SearchInput.module.scss';

export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  ariaLabel?: string;
}

/**
 * SearchInput: a labelled `input[type=search]` with a leading magnifier
 * icon. The visible placeholder serves as the label substitute for sighted
 * users but a sr-only <label> is rendered for accessibility.
 */
export default function SearchInput({
  placeholder = 'Search',
  value,
  defaultValue,
  onChange,
  ariaLabel,
}: SearchInputProps): JSX.Element {
  const id = useId();
  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={styles.label}>
        {ariaLabel || placeholder}
      </label>
      <span className={styles.icon} aria-hidden="true">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <input
        id={id}
        type="search"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </div>
  );
}
