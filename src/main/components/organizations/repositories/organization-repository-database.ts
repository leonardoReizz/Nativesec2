/* eslint-disable class-methods-use-this */
import { myDatabase } from 'main/ipc/database';
import { OrganizationModelDatabase } from '../model/Organization';
import { IOrganizationRepositoryDatabase } from './organization-repository-database-interface';

export class OrganizationRepositoryDatabase
  implements IOrganizationRepositoryDatabase
{
  async create(organization: any): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      return myDatabase.run(
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
          '${organization.name}',
          '${organization.description}',
          '${organization.theme}',
          '${organization.ownerEmail}',
          '${organization.creationDate}',
          '${organization.updateDate}',
          '${organization.limitUsers}',
          '${organization.storageLimit}',
          '${organization.participantGuests}',
          '${organization.adminGuests}',
          '${organization.participants}',
          '${organization.admins}',
          '${organization.deleted}'
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
    return new Promise((resolve, reject) => {
      myDatabase.run(
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
    return new Promise((resolve, reject) => {
      myDatabase.all(
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

  async updateGuestParticipants(newGuests: string) {}
}
