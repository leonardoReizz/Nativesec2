import { useContext } from 'react';
import { LoadingContext } from 'renderer/contexts/LoadingContext/LoadingContext';

export function useLoading() {
  const loading = useContext(LoadingContext);

  return { ...loading };
}
