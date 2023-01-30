/* eslint-disable react/require-default-props */
import { BsFillTrashFill } from 'react-icons/bs';
import { ThemeType } from 'renderer/contexts/UserConfigContext/types';
import styles from './styles.module.sass';

interface IParticipantProps {
  name: string;
  callback: (name: string) => void;
  theme?: ThemeType;
}

export function Participant({
  name,
  callback,
  theme = 'light',
}: IParticipantProps) {
  const initialLetter = name[0];
  return (
    <div
      className={`${styles.participant}  ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.info}>
        <div className={styles.img}>{initialLetter}</div>
        <span>{name}</span>
      </div>

      <button type="button" onClick={() => callback(name)}>
        <BsFillTrashFill />
      </button>
    </div>
  );
}
