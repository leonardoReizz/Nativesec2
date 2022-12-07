/* eslint-disable react/jsx-no-bind */
import { useCallback, useState } from 'react';
import { ButtonOutlined } from 'renderer/components/Buttons/ButtonOutlined';
import { useIPCAuth } from 'renderer/hooks/useIPCAuth/useIPCAuth';
import { toast } from 'react-toastify';
import { LoadingType } from 'renderer/routes';
import { Login } from './Login';
import { Register } from './Register';

import vault from '../../../../assets/svg/vault.svg';
import securityImage from '../../../../assets/svg/security2.svg';

import styles from './styles.module.sass';

export type AuthStateType =
  | 'login'
  | 'register'
  | 'enter'
  | 'token'
  | 'searchKey';

interface AuthProps {
  changeLoadingState: (state: LoadingType) => void;
}

export function Auth({ changeLoadingState }: AuthProps) {
  const [authState, setAuthState] = useState<AuthStateType>('login');

  const handleAuthState = useCallback((state: AuthStateType) => {
    toast.dismiss('resendToken');
    setAuthState(state);
  }, []);

  useIPCAuth({ changeAuthState: handleAuthState, changeLoadingState });

  return (
    <div
      className={`${styles.container} ${
        authState === 'register' ? styles.signUpMode : ''
      }`}
    >
      <div className={styles.form}>
        <div className={styles.register}>
          <Register />
        </div>
        <div className={styles.login}>
          <Login
            changeLoadingState={changeLoadingState}
            handleAuthState={handleAuthState}
            authState={authState}
          />
        </div>
      </div>

      <div className={styles.text}>
        <div className={styles.registerText}>
          <h1>Crie uma Conta</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat,
            porro nam, magnam facilis sint ad doloremque nulla expedita minus
            praesentium illum. Dolor sunt autem consequatur animi eos, tempore
            quis. Distinctio.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat,
            porro nam, magnam facilis sint ad doloremque nulla expedita minus
            praesentium illum. Dolor sunt autem consequatur animi eos, tempore
            quis. Distinctio.
          </p>
          <ButtonOutlined
            type="button"
            text="Entrar"
            onClick={() => handleAuthState('login')}
          />
        </div>
        <div className={styles.loginText}>
          <h1>Entre Agora Mesmo</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat,
            porro nam, magnam facilis sint ad doloremque nulla expedita minus
            praesentium illum. Dolor sunt autem consequatur animi eos, tempore
            quis. Distinctio.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat,
            porro nam, magnam facilis sint ad doloremque nulla expedita minus
            praesentium illum. Dolor sunt autem consequatur animi eos, tempore
            quis. Distinctio.
          </p>
          <ButtonOutlined
            type="button"
            text="Registrar"
            onClick={() => handleAuthState('register')}
          />
        </div>
      </div>

      <div className={styles.background}>
        <img src={vault} />
        <img src={securityImage} />
      </div>
    </div>

  );
}
