/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import PATH from 'path';
import database from '../database';

export async function getDatabaseVersion() {
  const version = await database.all(`SELECT * FROM database_version`);
  if (version.length === 0) {
    await database.run(
      'CREATE TABLE IF NOT EXISTS database_version (version TEXT)'
    );
    return undefined;
  }
  return version[0];
}

export async function insertVersion(version: string) {
  return database.run(
    `INSERT INTO database_version (version) VALUES ('${version}') `
  );
}

export async function updateVersion(version: string) {
  return database.run(`UPDATE database_version SET version = '${version}'`);
}

export async function updateDatabase(version: string) {
  const path = PATH.join('./versions', `${version}.ts`);
  if (path) {
    const updateDatase = require(`./versions/${version}.ts`);
    await updateDatase.update();
  }
}
