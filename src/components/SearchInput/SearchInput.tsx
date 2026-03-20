import styles from './SearchInput.module.css';

type SearchInputProps = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
};

export function SearchInput({ value, onChange, placeholder = 'Например, Emily' }: SearchInputProps) {
  return (
    <div>
      <label className={styles.searchLabel} htmlFor="user-search">
        Поиск по имени
      </label>
      <input
        className={styles.searchInput}
        id="user-search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}
