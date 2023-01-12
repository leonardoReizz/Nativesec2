import { useState } from 'react';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Form } from './Form';
import Users from './Users';
import styles from './styles.module.sass';

export function MainSafeBox() {
  const [tab, setTab] = useState<'form' | 'users'>('form');
  const { theme } = useUserConfig();

  function handleTabForm() {
    setTab('form');
  }
  function handleTabUsers() {
    setTab('users');
  }

  return (
    <div
      className={`${styles.mainSafeBox} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.menu}>
        <button
          type="button"
          onClick={handleTabForm}
          className={`${tab === 'form' ? styles.selected : ''}`}
        >
          Cofre
        </button>
        <button
          type="button"
          onClick={handleTabUsers}
          className={`${tab === 'users' ? styles.selected : ''}`}
        >
          Usuarios
        </button>
      </div>
      {tab === 'form' ? <Form /> : <Users />}
    </div>
  );
}
