import { SafeBoxesContext } from '@/renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { useContext } from 'react';

export function useSafeBox() {
  const safeBoxContext = useContext(SafeBoxesContext);
  return { ...safeBoxContext };
}
