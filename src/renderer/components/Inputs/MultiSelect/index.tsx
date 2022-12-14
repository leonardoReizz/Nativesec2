/* eslint-disable react/jsx-props-no-spreading */
import Select, { MultiValue } from 'react-select';
import { ThemeType } from 'renderer/@types/types';
import styles from './styles.module.sass';

interface MultiSelectProps {
  value: any;
  options: any;
  isDisable: boolean;
  theme: ThemeType;
  placeholder: string;
  onChange: (e: MultiValue<any>, type: 'admin' | 'participant') => void;
}

export function MultiSelect({ theme, onChange, ...props }: MultiSelectProps) {
  return (
    <div className={styles.input}>
      <p>Participantes</p>
      <Select
        {...props}
        className={styles.selectSearch}
        classNamePrefix="mySelect"
        isOptionDisabled={() => false}
        noOptionsMessage={() => 'Nenhum usuario'}
        isMulti
        theme={(themes) => ({
          ...themes,
          borderRadius: 7,
          colors: {
            ...themes.colors,
            primary: theme === 'dark' ? '#000000' : '#e3e5e8',
            primary25: theme === 'light' ? '#e3e5e8' : '#2f3136',
            neutral5: '#FFFFFF',
          },
        })}
        onChange={(e) => onChange(e, 'participant')}
      />
    </div>
  );
}
