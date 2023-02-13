import { newDatabase } from '../../../main';
import { DatabaseRepositoryInterface } from './database-repository-interface';

export class DatabaseRepository implements DatabaseRepositoryInterface {
  async update() {
    await newDatabase.migration();
  }
}
