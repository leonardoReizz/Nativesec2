interface IIPCResponse {
  data: any;
  message: 'ok' | 'nok' | 'noKey' | 'invalidSafetyPhrase' | 'accountExists';
  type?: string;
}

type ThemeType = 'light' | 'dark';

interface IUser {
  fullName: string;
  savePrivateKey: string | null;
  refreshTime: number;
  theme: ThemeType;
  lastOrganizationId: string | null;
  email: string;
  safetyPhrase: string;
}

interface IToken {
  accessToken: string;
  tokenType: string;
}

interface APIResponse {
  data: any;
  status: number;
}

interface IKeys {
  privateKey: string;
  privateKeyId: string;
  publicKey: string;
  publicKeyId: string;
  savePrivateKey: boolean;
}
