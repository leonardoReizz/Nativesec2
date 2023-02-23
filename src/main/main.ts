/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable global-require */
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater, UpdateDownloadedEvent } from 'electron-updater';
import log from 'electron-log';
import fs from 'fs';
import os from 'os';
import Store from 'electron-store';
import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import '@sentry/tracing';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

import * as types from './types';
import { useIpcActions } from './ipc';
import { Database } from './database/MyDatabase';
import { refreshTokenController } from './components/auth/use-cases/refreshToken/index';

export const store = new Store();
export const newDatabase = new Database();

Sentry.init({
  dsn: 'https://e6de462192cb45669faf6bb33ed50e64@o4504689765187584.ingest.sentry.io/4504689781768192',

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

store.clear();
store.set('initialData', {});
store.set('organizationInvites', []);
store.set('logged', false);
const VERSIONNPM = process.env.npm_package_version;
const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    if (!isDevelopment)
      setInterval(() => {
        autoUpdater.checkForUpdates();
      }, 60000);

    autoUpdater.on('update-available', () => {
      log.info('Update available');
    });

    autoUpdater.on('update-downloaded', (event: UpdateDownloadedEvent) => {
      log.info('Update downloaded');
      store.set('initialData', {
        ...(store.get('initialData') as types.IInitialData),
        updateAvaliable: true,
        updateInfo: {
          message:
            process.platform === 'win32'
              ? event.releaseNotes
              : event.releaseName,
          detail: 'Nova versão disponivel para instalar.',
        },
      });
    });
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});

ipcMain.on('updateQuitAndInstall', (event, arg) => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('initialData', (event, arg) => {
  const PATH = app.getPath('userData');
  const VERSION = app.getVersion();
  const LOCALE_STRING = app.getLocaleCountryCode();

  if (!fs.existsSync(path.join(PATH, 'database'))) {
    fs.mkdir(path.join(PATH, 'database'), (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  if (!fs.existsSync(path.join(PATH, 'DATA'))) {
    fs.mkdir(path.join(PATH, 'DATA'), (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  store.set('initialData', {
    PATH,
    locale_string: LOCALE_STRING,
    version: VERSION,
    hostname: os.hostname(),
    updateAvaliable: false,
  });

  store.set('keys', {});
});

ipcMain.on('closeModal', async (event, arg) => {
  event.reply('closeModal');
});

ipcMain.on(
  'useIPC',
  async (event: Electron.IpcMainEvent, arg: types.UseIPCData) => {
    const currentDate = Math.floor(Date.now() / 1000);

    if (arg.event === IPCTypes.SESSION_EXPIRED) {
      store.set('keys', {});
      store.set('user', {});
      store.set('logged', false);
      store.set('safebox', []);
      store.set('organizations', []);
      store.set('organizationInvites', []);
      newDatabase.clear();
      return event.reply(IPCTypes.SESSION_EXPIRED, { data: { type: 'close' } });
    }

    const tokenDate = (store.get('token') as any)?.createdAt;
    if (tokenDate) {
      if (tokenDate + 1200 < currentDate) {
        const result = await refreshTokenController.handle();

        if (result.data.message === 'authorizationError') {
          newDatabase.clear();
          return event.reply(IPCTypes.SESSION_EXPIRED, {});
        }
      }
    }

    const date = new Date();
    const newQueue = {
      id: `${arg.event}${date.getSeconds()}${date.getMilliseconds()}`,
      event: arg.event,
      data: arg.data,
      ipcEvent: event,
    };

    const result = await useIpcActions(newQueue);
    console.log(result)
    return newQueue.ipcEvent.reply(result?.response, result.data);
  }
);

ipcMain.on('createPath', async (event, arg) => {
  const { PATH } = store.get('initialData') as types.IInitialData;
  await newDatabase.createPATH(PATH);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  let appVersion = app.getVersion();

  if (isDevelopment) {
    appVersion = `${VERSIONNPM}-dev`;

    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    height: 600,
    width: 1024,
    minHeight: 600,
    minWidth: 1024,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.setTitle(`NativeSec ${appVersion}`);
    }
  });

  mainWindow.on('closed', () => {
    store.clear();
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', async () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    store.clear();
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
