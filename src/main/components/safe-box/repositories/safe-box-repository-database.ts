import { newDatabase } from '../../../main';
import { SafeBoxDatabaseModel } from '../model/SafeBox';
import { SafeBoxRepositoryDatabaseInterface } from './safe-box-repository-database-interface';

export class SafeBoxRepositoryDatabase
  implements SafeBoxRepositoryDatabaseInterface
{
  async create(data: SafeBoxDatabaseModel): Promise<boolean | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO safebox (
          _id,
          anexos ,
          conteudo ,
          criptografia ,
          descricao ,
          nome ,
          organizacao ,
          tipo ,
          data_hora_create,
          data_atualizacao,
          usuarios_escrita_deletado,
          usuarios_leitura_deletado,
          usuarios_escrita ,
          usuarios_leitura
        ) VALUES (
          '${data._id}',
          '${data.anexos}',
          '${data.conteudo}',
          '${data.criptografia}',
          '${data.descricao}',
          '${data.nome}',
          '${data.organizacao}',
          '${data.tipo}',
          '${data.data_hora_create}',
          '${data.data_atualizacao}',
          '${data.usuarios_escrita_deletado}',
          '${data.usuarios_leitura_deletado}',
          '${data.usuarios_escrita}',
          '${data.usuarios_leitura}'
        )`,
        (error) => {
          if (error) {
            console.log(error, ' ERROR DATABASE CREATE SAFE BOX');
            reject(error);
          }
          resolve(true);
        }
      );
    });
  }

  async delete(safeBoxId: string): Promise<boolean | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `
          DELETE FROM safebox
          WHERE _id = '${safeBoxId}'
        `,
        (error) => {
          if (error) {
            console.log(error, 'ERROR DATABASE DELETE SAFE BOX');
            reject(error);
          }
          resolve(true);
        }
      );
    });
  }

  async update(
    data: Omit<SafeBoxDatabaseModel, 'data_hora_create'>
  ): Promise<boolean | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `
          UPDATE safebox SET
          anexos = '${data.anexos}',
          conteudo = '${data.conteudo}',
          criptografia = 'rsa',
          usuarios_escrita_deletado = '${data.usuarios_escrita_deletado}',
          usuarios_leitura_deletado = '${data.usuarios_leitura_deletado}',
          descricao = '${data.descricao}',
          nome = '${data.nome}',
          tipo = '${data.tipo}',
          data_atualizacao = '${data.data_atualizacao}',
          usuarios_escrita = '${data.usuarios_escrita}',
          usuarios_leitura = '${data.usuarios_leitura}'
          WHERE _id = '${data._id}'
          AND organizacao = '${data.organizacao}'
        `,
        (error) => {
          if (error) reject(error);

          resolve(true);
        }
      );
    });
  }

  async list(organizationId: string) {
    const db = newDatabase.getDatabase();
    const select: SafeBoxDatabaseModel[] = await new Promise(
      (resolve, reject) => {
        db.all(
          `SELECT * FROM safebox WHERE organizacao = '${organizationId}'`,
          (error, rows) => {
            if (error) reject(error);
            resolve(rows);
          }
        );
      }
    );

    if (select instanceof Error) {
      return select;
    }

    const sort = select.sort((x, y) => {
      const a = x.nome.toUpperCase();
      const b = y.nome.toUpperCase();
      return a == b ? 0 : a > b ? 1 : -1;
    });

    return sort;
  }

  async deleteByOrganizationId(organizationId: string) {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM safebox WHERE organizacao = '${organizationId}'`,
        (error) => {
          if (error) reject(error);
          resolve(true);
        }
      );
    });
  }
}
