import { toast } from 'react-toastify';
import { Button } from 'renderer/components/Buttons/Button';
import { Input } from 'renderer/components/Inputs/Input';
import { toastOptions } from 'renderer/utils/options/Toastify';

import styles from './styles.module.sass';

export function Token() {
  function resendToken() {
    toast.success('Um token foi enviado para seu email', {
      ...toastOptions,
      toastId: 'resendToken',
    });
  }
  return (
    <div className={styles.token}>
      <form action="">
        <Input text="Token" type="password" />
        <Input text="Frase Secreta" type="password" />
        <Button text="Entrar" />
      </form>

      <button
        type="button"
        className={styles.resendToken}
        onClick={resendToken}
      >
        Reenviar Token
      </button>
    </div>
  );
}
