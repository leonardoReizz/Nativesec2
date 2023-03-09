/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable react/require-default-props */

import LottieControl from 'renderer/components/LottieControl';
import { IconType } from 'react-icons';
import { HTMLProps, ReactElement } from 'react';
import animationData from '../../../../../assets/animationsJson/loading-button.json';
import styles from './styles.module.sass';

interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  text?: string;
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  theme?: ThemeType;
  Icon?: ReactElement<IconType, IconType>;
  color?: 'red' | 'green' | 'blue' | 'lightGreen';
}

export function Button({
  text,
  isLoading,
  className,
  theme = 'light',
  Icon,
  color,
  ...props
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
              : color === 'lightGreen'
              ? styles.lightGreen
              : ''
          }`}
          {...props}
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
