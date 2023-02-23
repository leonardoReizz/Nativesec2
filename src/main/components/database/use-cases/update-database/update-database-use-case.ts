import { DatabaseRepository } from '../../repositories/database-repository';

export class UpdateDatabaseUseCase {
  constructor(private databaseRepository: DatabaseRepository) {}

  async execute() {
    await this.databaseRepository.update();

    return {
      message: 'ok',
    };
  }
}
