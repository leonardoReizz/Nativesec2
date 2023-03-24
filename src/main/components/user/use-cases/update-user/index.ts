import { UserRepositoryDatabase } from '@/main/components/user/repositories/user-repository-database';
import { UpdateUserController } from './update-user-controller';
import { UpdateUserUseCase } from './update-user-use-case';

const userRepositoryDatabase = new UserRepositoryDatabase();
const updateUserUseCase = new UpdateUserUseCase(userRepositoryDatabase);
const updateUserController = new UpdateUserController(updateUserUseCase);
export { updateUserController };
