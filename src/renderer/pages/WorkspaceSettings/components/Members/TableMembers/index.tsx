import { BsFillTrashFill } from 'react-icons/bs';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import styles from './styles.module.sass';

interface TableMembersProps {
  options: string[];
  title: string;
  callback: (user: string) => void;
}

export function TableMembers({ title, options, callback }: TableMembersProps) {
  const { theme } = useUserConfig();
  return (
    <div
      className={`${styles.tableMembers} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.title}>
        <h4>{title}</h4>
      </div>
      <div className={styles.membersSection}>
        {options?.map((user: string) => (
          <div className={styles.participant}>
            <div className={styles.info}>
              <div className={styles.img}>{user[0]}</div>
              <span>{user}</span>
            </div>
            <button type="button" onClick={() => callback(user)}>
              <BsFillTrashFill />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
