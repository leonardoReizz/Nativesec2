/* eslint-disable class-methods-use-this */
import { newDatabase } from '../../../main';
import { OrganizationModelDatabase } from '../model/Organization';
import { IOrganizationRepositoryDatabase } from './organization-repository-database-interface';

export class OrganizationRepositoryDatabase
  implements IOrganizationRepositoryDatabase
{
  async create(
    organization: OrganizationModelDatabase
  ): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      const db = newDatabase.getDatabase();
      return db.run(
        `
          INSERT INTO organizations (
          _id,
          nome,
          descricao,
          tema,
          dono,
          data_criacao,
          data_atualizacao,
          limite_usuarios,
          limite_armazenamento,
          convidados_participantes,
          convidados_administradores,
          participantes,
          administradores,
          deletado
        )
        VALUES(
          '${organization._id}',
          '${organization.nome}',
          '${organization.descricao}',
          '${organization.tema}',
          '${organization.dono}',
          '${organization.data_criacao}',
          '${organization.data_atualizacao}',
          '${organization.limite_usuarios}',
          '${organization.limite_armazenamento}',
          '${organization.convidados_participantes}',
          '${organization.convidados_administradores}',
          '${organization.participantes}',
          '${organization.administradores}',
          '${organization.deletado}'
        )
        `,
        (error) => {
          if (error) {
            console.log(error, ' ERRO DATABASE CREATE ORGANIZATION ICON');
            reject(error);
          }
          resolve(true);
        }
      );
    });
  }

  async delete(organizationId: string): Promise<boolean | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM organizations WHERE _id = '${organizationId}'`,
        (error) => {
          if (error) {
            console.log(error, ' ERRO DATABASE DELETE ORGANIZATION');
            reject(error);
          }
          resolve(true);
        }
      );
    });
  }

  async findById(
    organizationId: string
  ): Promise<OrganizationModelDatabase | Error | undefined> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT *  FROM organizations WHERE _id = '${organizationId}'`,
        async (error, rows) => {
          if (error) {
            console.log(error, ' ERRO DATABASE FIND ORGANIZATION BY ID');
            reject(error);
          }
          if (rows.length > 0) {
            const organization = rows[0] as OrganizationModelDatabase;
            resolve(organization);
          }
          resolve(undefined);
        }
      );
    });
  }

  async update(
    data: Omit<OrganizationModelDatabase, 'data_criacao'>
  ): Promise<boolean | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE organizations SET
        nome = '${data.nome}',
        tema = '${data.tema}',
        dono = '${data.dono}',
        descricao = '${data.descricao}',
        data_atualizacao = '${data.data_atualizacao}',
        convidados_participantes = '${data.convidados_participantes}',
        convidados_administradores = '${data.convidados_administradores}',
        limite_usuarios = '${data.limite_usuarios}',
        limite_armazenamento = '${data.limite_armazenamento}',
        participantes = '${data.participantes}',
        administradores = '${data.administradores}',
        deletado = '${data.deletado}'
        WHERE _id = '${data._id}'
      `,
        (error) => {
          if (error) reject(error);
          resolve(true);
        }
      );
    });
  }
}
