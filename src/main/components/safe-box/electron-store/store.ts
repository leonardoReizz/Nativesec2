import { newDatabase, store } from '../../../main';
import { SafeBoxDatabaseModel } from '../model/SafeBox';

export async function refreshSafeBoxes(organizationId: string) {
  const db = newDatabase.getDatabase();
  const select: SafeBoxDatabaseModel[] = await new Promise(
    (resolve, reject) => {
      db.all(
        `SELECT * FROM safebox WHERE organizacao = '${organizationId}'`,
        async (error, rows) => {
          if (error) {
            reject(error);
          }
          resolve(rows);
        }
      );
    }
  );

  if (select instanceof Error) {
    throw new Error('Erro database refresh safeboxes');
  }

  const sort = select.sort((x, y) => {
    const a = x.nome.toUpperCase();
    const b = y.nome.toUpperCase();
    return a == b ? 0 : a > b ? 1 : -1;
  });

  store.set('safebox', sort);
}
