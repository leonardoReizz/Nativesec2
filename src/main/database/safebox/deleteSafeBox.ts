import database from '../database';
import { DatabaseReturnType } from '../types';

export interface DeleteSafeBoxProps {
  safeBoxId: string;
}

const deleteSafeBox = async ({
  safeBoxId,
}: DeleteSafeBoxProps): DatabaseReturnType => {
  return database.run(
    `
      DELETE FROM safebox
      WHERE _id = '${safeBoxId}'
    `
  );
};

export default deleteSafeBox;
