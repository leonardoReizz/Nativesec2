import { Button } from 'renderer/components/Buttons/Button';
import { Input } from 'renderer/components/Inputs/Input';
import { AuthState } from '..';
import styles from './styles.module.sass';
import nativeSecLogo from '../../../../../assets/logoNativesec/brand-nativesec.svg'

interface RegisterProps {
  changeAuthState: (state: AuthState) => void;
}

export function Register() {

  function handleLogin() {
    changeAuthState('login');
  }

  return (
    <div className={styles.register}>
      <img src={nativeSecLogo} alt="" />
      <form action="#" className={styles.register}>
        <Input text="Nome Completo" />
        <Input text="Email"/>
        <Input text="Frase Secreta"/>
        <Input text="Confirme a Frase Secreta"/>
        <Button text="Criar conta"/>
      </form>
    </div>
  )
}
