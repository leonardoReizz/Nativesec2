import { ReactNode } from 'react';

export interface IUserConfig {
  lastOrganizationId: string;
  refreshTime: string;
  theme: string;
  savePrivateKey: string;
  email: string;
}

export interface UserConfigContextType {
  lastOrganizationId: string;
  refreshTime: string;
  theme: string;
  savePrivateKey: string;
  updateUserConfig: (newUserConfig: IUserConfig) => void;
  updateLastOrganizationId: (newLastOrganizationId: string) => void;
  updateRefreshTime: (newRefreshTime: string) => void;
  updateTheme: (newTheme: string) => void;
  updateSavePrivateKey: (newSavePrivateKey: string) => void;
}

export interface UserConfigContextProviderProps {
  children: ReactNode;
}

export type ThemeType = 'light' | 'dark';
