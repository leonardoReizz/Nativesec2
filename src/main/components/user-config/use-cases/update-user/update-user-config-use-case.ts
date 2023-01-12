import { UserConfigRepositoryDatabase } from '../../repositories/user-config-repository-database';
import { UpdateUserConfigRequestDTO } from './update-user-config-request-dto';

export class UpdateUserConfigUseCase {
  constructor(
    private userConfigRepositoryDatabase: UserConfigRepositoryDatabase
  ) {}

  async execute(data: UpdateUserConfigRequestDTO) {
    window.electron.store.set('userConfig', { ...data });
    return this.userConfigRepositoryDatabase.update(data);
  }
}
