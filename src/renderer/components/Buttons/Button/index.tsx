/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable react/require-default-props */

import LottieControl from 'renderer/components/LottieControl';
import animationData from '../../../../../assets/animationsJson/loading-button.json';
import styles from './styles.module.sass';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  text?: string;
  onClick?: () => void;
  isLoading?: boolean;
}
export function Button({ type, text, onClick, isLoading }: ButtonProps) {
  return (
    <div className={styles.button}>
      {!isLoading ? (
        <button
          className={styles.button}
          type={type || 'button'}
          onClick={onClick}
        >
          {text}
        </button>
      ) : (
        <LottieControl animationData={animationData} play loop />
      )}
    </div>
  );
}
