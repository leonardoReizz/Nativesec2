type StoreGetType =
  | 'organizations'
  | 'user'
  | 'safebox'
  | 'safeboxGroup'
  | 'logged'
  | 'token'
  | 'keys'
  | 'iconeAll';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: string, args: any): void;
        on(
          channel: string,
          func: (...args: any[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: any[]) => void): void;
      };
      store: {
        get: (key: StoreGetType) => any;
        set: (key: string, val: any) => void;
        // any other methods you've defined...
      };
    };
  }
}

export {};
