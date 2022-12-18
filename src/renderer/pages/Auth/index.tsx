/* eslint-disable jsx-a11y/alt-text */
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
  | 'login-step-one'
  | 'login-step-two'
  | 'register-step-one'
  | 'register-step-two'
  | 'enter'
  | 'token'
  | 'searchKey';

interface AuthProps {
  changeLoadingState: (state: LoadingType) => void;
}

export function Auth({ changeLoadingState }: AuthProps) {
  const [authState, setAuthState] = useState<AuthStateType>('login-step-one');

  const handleAuthState = useCallback((state: AuthStateType) => {
    toast.dismiss('resendToken');
    setAuthState(state);
  }, []);

  useIPCAuth({ changeAuthState: handleAuthState, changeLoadingState });

  return (
    <div
      className={`${styles.container} ${
        authState === 'register-step-one' || authState === 'register-step-two'
          ? styles.signUpMode
          : ''
      }`}
    >
      <div className={styles.form}>
        <div className={styles.register}>
          <Register changeAuthState={handleAuthState} authState={authState} />
        </div>
        <div className={styles.login}>
          <Login
            changeLoadingState={changeLoadingState}
            changeAuthState={handleAuthState}
            authState={authState}
          />
        </div>
      </div>

      <div className={styles.text}>
        <div className={styles.registerText}>
          <h1>Entre</h1>
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
            onClick={() => handleAuthState('login-step-one')}
          />
        </div>
        <div className={styles.loginText}>
          <h1>Registre-se Agora Mesmo</h1>
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
            onClick={() => handleAuthState('register-step-one')}
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
