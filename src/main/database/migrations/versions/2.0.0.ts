import sqlite3 from '@journeyapps/sqlcipher';

export interface ITables {
  name: string;
  query: string;
}

const tables = [
  {
    name: 'pubKey',
    query: 'ALTER TABLE public_keys ADD _id type TEXT',
  },
  {
    name: 'safeBoxParticipant',
    query: 'ALTER TABLE private_keys ADD _id type TEXT',
  },
];

export async function update(db: sqlite3.Database) {
  await Promise.all(
    tables.map(async (table) => {
      await db.run(table.query);
    })
  );
}
