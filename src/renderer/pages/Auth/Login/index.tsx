/* eslint-disable react/jsx-no-bind */
import { Input } from 'renderer/components/Inputs/Input';
import { Button } from 'renderer/components/Buttons/Button';
import { useEffect, useState } from 'react';
import styles from './styles.module.sass';
import nativeSecLogo from '../../../../../assets/logoNativesec/brand-nativesec.svg';
import { Auth, AuthState } from '..';
import { Token } from './Token';

interface LoginProps {
  handleAuthState: (state: AuthState) => void;
  changeLoadingState: (state: boolean) => void;
}

export function Login({ handleAuthState, changeLoadingState }: LoginProps) {
  const [buttonIsLoading, setButtonIsLoading] = useState<boolean>(false);
  const [state, setState] = useState<string>('login');

  function handleSubmit() {
    setState('token');
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('auth-response', () =>{
      setState('token');
    });
  }, []);

  return (
    <div className={styles.login}>
      <img src={nativeSecLogo} alt="" />
      {state === 'login' ? (
        <form action="">
          <Input type="text" text="Email" />
          <Button
            type="submit"
            text="Gerar Token"
            onClick={() => handleSubmit()}
            isLoading={buttonIsLoading}
          />
        </form>
      ) : (
        <Token />
      )}
    </div>
  );
}
