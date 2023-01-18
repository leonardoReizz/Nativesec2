import { validateEmail } from 'main/crypto/utils';
import { useState } from 'react';
import Badge from 'renderer/components/Badge';
import { Button } from 'renderer/components/Buttons/Button';
import ToggleSwitch from 'renderer/components/Buttons/ToggleSwitch';
import { Input } from 'renderer/components/Inputs/Input';
import { StepFourProps } from '../types';
import styles from './styles.module.sass';

export function StepThree({ users, setUsers, currentTheme }: StepFourProps) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailIsValid, setEmailIsValid] = useState<boolean>(true);

  const handleSetEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleAddUser = () => {
    if (validateEmail(email)) {
      if (users.length > 0) {
        users.map((user) => {
          if (user.email === email) {
            setEmailIsValid(false);
          } else {
            setUsers([...users, { email, isAdmin }]);
            setEmail('');
            setEmailIsValid(true);
          }
        });
      } else {
        setUsers([...users, { email, isAdmin }]);
        setEmail('');
        setEmailIsValid(true);
      }
    } else {
      setEmailIsValid(false);
    }
  };

  const handleDeleteUser = (userEmail: string) => {
    const filter = users.filter((user) => {
      if (user.email !== userEmail) {
        return user;
      }
      return undefined;
    });
    setUsers(filter);
  };

  return (
    <div
      className={`${styles.stepFour} ${
        currentTheme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <h3>Convide os membros de seu Workspace</h3>

      <div className={styles.list}>
        <div>
          <h4>Participantes</h4>
          <h4>Administradores</h4>
        </div>
        <div className={styles.emails_container}>
          <div className={styles.emails_list}>
            {users.map(
              (user) =>
                !user.isAdmin && (
                  <Badge
                    key={user.email}
                    text={user.email}
                    onClick={() => handleDeleteUser(user.email)}
                  />
                )
            )}
          </div>
          <div className={styles.emails_list}>
            {users.map(
              (user) =>
                user.isAdmin && (
                  <Badge
                    key={user.email}
                    text={user.email}
                    onClick={() => handleDeleteUser(user.email)}
                  />
                )
            )}
          </div>
        </div>
      </div>
      <div className={styles.email}>
        <div>
          <Input
            text="Email"
            onChange={handleSetEmail}
            isValid={emailIsValid}
            value={email}
            theme={currentTheme}
          />
          <div className={styles.email_switch}>
            <ToggleSwitch onChange={(e) => setIsAdmin(e.target.checked)} />
            <p>{isAdmin === true ? 'Administrador' : 'Participante'}</p>
          </div>
          {!emailIsValid && <p className={styles.error}>Email Invalido</p>}
        </div>
        <Button text="Adicionar Membro" onClick={handleAddUser} />
      </div>
    </div>
  );
}
