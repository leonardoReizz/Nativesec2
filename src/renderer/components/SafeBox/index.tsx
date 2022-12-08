import { SiKubernetes } from 'react-icons/si';
import styles from './styles.module.sass';

interface SafeBoxProps {
  Icon: IconType;
}

export function SafeBox() {
  return (
    <div className={styles.safebox}>
      <SiKubernetes />
      <div className={styles.text}>
        <h3>Este é um cofre para testar</h3>
        <p>
          este e a descricao do cofre que vamos deixar aqui para mostrar ao que se
          refere
        </p>
      </div>
    </div>
  )
}
