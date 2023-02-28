import { newDatabase } from '@/main/main';
import { ISafeBoxGroupModelDatabase } from '../model/safe-box-group';
import { ISafeBoxGroupRepositoryDatabaseInterface } from './safe-box-group-repository-database-interface ';

export class SafeBoxGroupRepositoryDatabase
  implements ISafeBoxGroupRepositoryDatabaseInterface
{
  async listByOrganizationId(
    organizationId: string
  ): Promise<ISafeBoxGroupModelDatabase[]> {
    const db = newDatabase.getDatabase();

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM safeBoxGroup WHERE organizacao = '${organizationId}'`,
        (error, rows) => {
          if (error) reject(error);
          resolve(rows);
        }
      );
    });
  }

  async list(): Promise<ISafeBoxGroupModelDatabase[] | Error> {
    const db = newDatabase.getDatabase();

    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM safeBoxGroup`, (error, rows) => {
        if (error) reject(error);
        resolve(rows);
      });
    });
  }

  async create(
    safeBoxGroup: ISafeBoxGroupModelDatabase
  ): Promise<true | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO safeBoxGroup (
          _id,
          cofres,
          data_hora_create,
          data_atualizacao,
          descricao,
          nome,
          organizacao,
          dono
        ) VALUES (
          '${safeBoxGroup._id}',
          '${safeBoxGroup.cofres}',
          '${safeBoxGroup.data_hora_create}',
          '${safeBoxGroup.data_atualizacao}',
          '${safeBoxGroup.descricao}',
          '${safeBoxGroup.nome}',
          '${safeBoxGroup.organizacao}',
          '${safeBoxGroup.dono}'
        )`,
        (error) => {
          if (error) reject(error);
          resolve(true);
        }
      );
    });
  }

  async deleteById(safeBoxGroupId: string): Promise<true | Error> {
    const db = newDatabase.getDatabase();

    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM safeBoxGroup where _id = '${safeBoxGroupId}'`,
        (error) => {
          if (error) reject(error);
          resolve(true);
        }
      );
    });
  }

  async update(
    safeBoxGroup: Omit<
      ISafeBoxGroupModelDatabase,
      'dono' | 'organizacao' | 'data_hora_create'
    >
  ): Promise<true | Error> {
    const db = newDatabase.getDatabase();

    return new Promise((resolve, reject) => {
      return db.run(
        `UPDATE safeBoxGroup SET
        cofres = '${safeBoxGroup.cofres}',
        data_atualizacao = ${safeBoxGroup.data_atualizacao},
        descricao = '${safeBoxGroup.descricao}',
        nome = '${safeBoxGroup.nome}'
        WHERE _id = '${safeBoxGroup._id}'
        `,
        (error) => {
          if (error) reject(error);
          resolve(true);
        }
      );
    });
  }
}
