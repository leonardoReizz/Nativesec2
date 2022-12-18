import { IOrganizationDatabase } from 'renderer/routes/types';
import database from '../database';
import { IIconsDatabase } from '../../ipc/organizations/types';

export async function listOrganizationsIcons(
  orgs: IOrganizationDatabase[]
): Promise<IIconsDatabase[]> {
  const icons = await Promise.all(
    orgs.map((org) => {
      const icon = database.get(
        `SELECT * FROM organizationsIcons WHERE _id = '${org._id}'`
      );

      return icon;
    })
  );
  return icons as unknown as IIconsDatabase[];
}
