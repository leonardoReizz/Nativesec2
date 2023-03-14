import { UserRepositoryDatabase } from '@/main/components/user/repositories/user-repository-database';
import { IPCError } from '@/main/utils/IPCError';
import { IUpdateUserConfigRequestDTO } from './update-user-request-dto';

export class UpdateUserConfigUseCase {
  constructor(private userRepositoryDatabase: UserRepositoryDatabase) {}

  async execute(data: IUpdateUserConfigRequestDTO) {
    const updateUser = await this.userRepositoryDatabase.updateUserConfig({
      ...data,
      savePrivateKey: String(data.savePrivateKey),
    });

    IPCError({
      object: updateUser,
      message: 'ERROR DATABASE UPDATE USER CONFIG',
      type: 'database',
    });
    return { message: 'ok' };
  }
}
