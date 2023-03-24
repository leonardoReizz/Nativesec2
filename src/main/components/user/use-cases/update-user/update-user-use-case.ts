import { UserRepositoryDatabase } from '@/main/components/user/repositories/user-repository-database';
import { IPCError } from '@/main/utils/IPCError';
import { IUpdateUserRequestDTO } from './update-user-request-dto';

export class UpdateUserUseCase {
  constructor(private userRepositoryDatabase: UserRepositoryDatabase) {}

  async execute(data: IUpdateUserRequestDTO) {
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
