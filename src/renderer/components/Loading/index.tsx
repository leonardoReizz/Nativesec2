/* eslint-disable react/style-prop-object */
import { LoadingType } from 'renderer/routes';
import LottieControl from '../LottieControl';
import styles from './styles.module.sass';

import animationData from '../../../../assets/animationsJson/airplane.json';

interface LoadingProps {
  isLoading: LoadingType;
  changeLoadingState: (state: LoadingType) => void;
}

export function Loading({ isLoading, changeLoadingState }: LoadingProps) {
  return (
    <div
      className={`${styles.loading} ${
        isLoading === 'true'
          ? styles.animated
          : isLoading === 'finalized'
          ? styles.finalized
          : styles.notAnimated
      }`}
    >
      <div className={styles.background}>
        <LottieControl animationData={animationData} play loop />
      </div>
    </div>
  );
}
