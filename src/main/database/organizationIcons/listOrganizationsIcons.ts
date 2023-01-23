import { myDatabase } from '../../ipc/database';
import { IIconsDatabase } from '../../ipc/organizations/types';

export async function listOrganizationsIcons(): Promise<IIconsDatabase[]> {
  return new Promise((resolve, reject) => {
    myDatabase.all(`SELECT * FROM organizationsIcons`, async (error, rows) => {
      if (error) reject(error);
      resolve(rows);
    });
  });
}
