import { ReactNode } from 'react';

export type ThemeType = 'light' | 'dark';

export interface IUserConfig {
  lastOrganizationId: string;
  refreshTime: number;
  theme: ThemeType;
  savePrivateKey: string;
  email: string;
}

export interface UserConfigContextType {
  lastOrganizationId: string;
  refreshTime: number;
  theme: ThemeType;
  savePrivateKey: string;
  updateUserConfig: (newUserConfig: IUserConfig) => void;
  updateLastOrganizationId: (newLastOrganizationId: string) => void;
  updateRefreshTime: (newRefreshTime: number) => void;
  updateTheme: (newTheme: string) => void;
  updateSavePrivateKey: (newSavePrivateKey: string) => void;
}

export interface UserConfigContextProviderProps {
  children: ReactNode;
}
