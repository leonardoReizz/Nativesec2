import { CreateSafeBoxContext } from '@/renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { useContext } from 'react';

export function useCreateSafeBox() {
  const createSafeBoxContext = useContext(CreateSafeBoxContext);
  return { ...createSafeBoxContext };
}
