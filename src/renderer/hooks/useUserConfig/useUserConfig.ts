import { UserConfigContext } from '@/renderer/contexts/UserConfigContext/UserConfigContext';
import { useContext } from 'react';

export function useUserConfig() {
  const userConfig = useContext(UserConfigContext);
  return { ...userConfig };
}
