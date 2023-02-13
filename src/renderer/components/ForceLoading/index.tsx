import LottieControl from '../LottieControl';
import animationData from '../../../../assets/animationsJson/loading-button.json';
import styles from './styles.module.sass';

interface ForceLoadingProps {
  isLoading: boolean;
}

export function ForceLoading({ isLoading }: ForceLoadingProps) {
  return (
    <div
      className={`${styles.forceLoading} ${isLoading ? styles.loading : ''}`}
    >
      <LottieControl animationData={animationData} play loop />
    </div>
  );
}
