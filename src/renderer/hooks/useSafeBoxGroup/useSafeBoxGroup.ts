import { SafeBoxGroupContext } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { useContext } from 'react';

export function useSafeBoxGroup() {
  const safeBoxGroupContext = useContext(SafeBoxGroupContext);

  return { ...safeBoxGroupContext };
}
