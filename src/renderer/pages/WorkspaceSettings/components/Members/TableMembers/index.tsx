import { useState } from 'react';
import { BsFillTrashFill } from 'react-icons/bs';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import styles from './styles.module.sass';

interface TableMembersProps {
  options: string[];
  title: string;
  callback: (user: string) => void;
}

const userOptions = [
  {
    id: 1,
    value: 'remove',
    label: 'Remover',
  },
];

export function TableMembers({ title, options, callback }: TableMembersProps) {
  const { theme } = useUserConfig();
  const [currentUserDelete, setCurrentUserDelete] = useState<
    string | undefined
  >(undefined);

  function handleRemoveInvite(email: string, type: 'admin' | 'participant') {
    setCurrentUserDelete({ email, type });
    setIsOpenVerifyNameModal(true);
  }

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
        {options?.map((option: string) => (
          <div className={styles.participant} key={user}>
            <h4>{user}</h4>
            <Dropdown
              theme={theme}
              options={userOptions}
              value="Leitura e Escrita"
              onChange={changeUser}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
