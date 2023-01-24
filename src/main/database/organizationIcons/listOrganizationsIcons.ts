import { newDatabase } from '../../main';
import { IIconsDatabase } from '../../ipc/organizations/types';

export async function listOrganizationsIcons(): Promise<IIconsDatabase[]> {
  const db = newDatabase.getDatabase();
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM organizationsIcons`, async (error, rows) => {
      if (error) reject(error);
      resolve(rows);
    });
  });
}
