/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable react/require-default-props */

import LottieControl from 'renderer/components/LottieControl';
import { IconType } from 'react-icons';
import { ReactElement } from 'react';
import animationData from '../../../../../assets/animationsJson/loading-button.json';
import styles from './styles.module.sass';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  text?: string;
  onClick?: () => void;
  isLoading?: boolean;
  className?: string;
  Icon?: ReactElement<IconType, IconType>;
}
export function Button({
  type,
  text,
  onClick,
  isLoading,
  className,
  Icon,
}: ButtonProps) {
  return (
    <div className={styles.button}>
      {!isLoading ? (
        <button
          className={`${styles.button} ${className && className}`}
          type={type || 'button'}
          onClick={onClick}
        >
          {Icon && Icon}
          {text}
        </button>
      ) : (
        <LottieControl animationData={animationData} play loop />
      )}
    </div>
  );
}
