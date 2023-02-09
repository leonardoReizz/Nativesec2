/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable react/require-default-props */

import LottieControl from 'renderer/components/LottieControl';
import { IconType } from 'react-icons';
import { ReactElement } from 'react';
import { ThemeType } from 'renderer/contexts/UserConfigContext/types';
import animationData from '../../../../../assets/animationsJson/loading-button.json';
import styles from './styles.module.sass';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  text?: string;
  onClick?: () => void;
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  theme?: ThemeType;
  Icon?: ReactElement<IconType, IconType>;
  color?: 'red' | 'green' | 'blue';
}

export function Button({
  type,
  text,
  onClick,
  isLoading,
  className,
  disabled = false,
  theme = 'light',
  Icon,
  color,
}: ButtonProps) {
  return (
    <div
      className={`${styles.button} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      {!isLoading ? (
        <button
          className={`${styles.button} ${className && className} ${
            color === 'red'
              ? styles.red
              : color === 'green'
              ? styles.green
              : color === 'blue'
              ? styles.blue
              : ''
          }`}
          type={type || 'button'}
          onClick={onClick}
          disabled={disabled}
        >
          {Icon && Icon}
          {text}
        </button>
      ) : (
        <div className={styles.loading}>
          <LottieControl animationData={animationData} play loop />
        </div>
      )}
    </div>
  );
}
