interface IIPCResponse {
  data: any;
  message: 'ok' | 'nok' | 'noKey' | 'invalidSafetyPhrase' | 'accountExists';
  type?: string;
}

type ThemeType = 'light' | 'dark';
