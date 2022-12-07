import { useEffect, useState } from 'react';
import { setInterval } from 'timers/promises';
import LottieControl from '../LottieControl';
import styles from './styles.module.sass';

import animationData from '../../../../assets/animationsJson/airplane.json'

interface LoadingProps {
  isLoading: boolean;
  changeLoadingState: (state: boolean) => void;
}

export function Loading({ isLoading, changeLoadingState }: LoadingProps) {

  return (
    <div className={`${styles.loading} ${isLoading ? styles.animated : ''}`}>
      <div className={styles.background}>
        <LottieControl animationData={animationData} play loop />
      </div>
    </div>
  );
}
