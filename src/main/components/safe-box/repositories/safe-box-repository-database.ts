import { myDatabase } from '../../../ipc/database';
import { SafeBoxDatabaseModel } from '../model/SafeBox';
import { SafeBoxRepositoryDatabaseInterface } from './safe-box-repository-database-interface';

export class SafeBoxRepositoryDatabase
  implements SafeBoxRepositoryDatabaseInterface
{
  async create(data: SafeBoxDatabaseModel): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      return myDatabase.run(
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
          '${data.id}',
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
            console.log(' ERROR DATABASE CREATE SAFE BOX');
            reject(error);
          }
          resolve(true);
        }
      );
    });
  }

  async delete(safeBoxId: string): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      return myDatabase.run(
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
}
