/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-bind */
import { ButtonOutlined } from 'renderer/components/Buttons/ButtonOutlined';
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
  authState: AuthStateType;
  handleAuthState: (state: AuthStateType) => void;
}

export function Auth({
  changeLoadingState,
  authState,
  handleAuthState,
}: AuthProps) {
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
          <h1>Crie sua conta</h1>
          <p>
            Segurança para suas senhas e dados sensíveis. Armazene e compartilhe
            de forma segura. Crie sua conta agora mesmo!
          </p>
          <span>Ja possui uma conta?</span>
          <ButtonOutlined
            type="button"
            text="Entrar"
            onClick={() => handleAuthState('login-step-one')}
          />
          <img src={vault} className={styles.firstImage} />
        </div>
        <div className={styles.loginText}>
          <h1>Bem Vindo</h1>
          <p>Seja bem vindo de volta! Acesse suas senhas e dados sensíveis. </p>
          <span>Ainda nao possui uma conta?</span>
          <ButtonOutlined
            type="button"
            text="Registre-se"
            onClick={() => handleAuthState('register-step-one')}
          />
          <img src={securityImage} className={styles.secondImage} />
        </div>
      </div>

      <div className={styles.background} />
    </div>
  );
}
