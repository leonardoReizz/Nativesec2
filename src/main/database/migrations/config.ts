/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import { newDatabase } from 'main/main';
import PATH from 'path';

export async function getDatabaseVersion() {
  const db = newDatabase.getDatabase();
  const version: any = new Promise((resolve, reject) => {
    db.all(`SELECT * FROM database_version`, (error, rows) => {
      if (error) reject(error);
      resolve(rows);
    });
  });
  if (version.length === 0) {
    await db.run('CREATE TABLE IF NOT EXISTS database_version (version TEXT)');
    return undefined;
  }
  return version[0];
}

export async function insertVersion(version: string) {
  const db = newDatabase.getDatabase();
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO database_version (version) VALUES ('${version}')`,
      (error) => {
        if (error) reject(error);
        resolve(true);
      }
    );
  });
}

export async function updateVersion(version: string) {
  const db = newDatabase.getDatabase();
  return new Promise((resolve, reject) => {
    db.run(`UPDATE database_version SET version = '${version}'`, (error) => {
      if (error) reject(error);
      resolve(true);
    });
  });
}

export async function updateDatabase(version: string) {
  const path = PATH.join('./versions', `${version}.ts`);
  if (path) {
    const updateDatase = require(`./versions/${version}.ts`);
    await updateDatase.update();
  }
}
