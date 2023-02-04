import { newDatabase, store } from '../../../main';

export async function refreshSafeBoxes(organizationId: string) {
  const db = newDatabase.getDatabase();
  const select = await db.all(
    `SELECT * FROM safebox WHERE organizacao = '${organizationId}'`
  );

  const sort = select.sort((x, y) => {
    const a = x.nome.toUpperCase();
    const b = y.nome.toUpperCase();
    return a == b ? 0 : a > b ? 1 : -1;
  });

  store.set('safebox', sort);
}
