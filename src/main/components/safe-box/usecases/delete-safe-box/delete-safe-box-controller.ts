import { IDeleteSafeBoxRequestDTO } from './delete-safe-box-request-dto';
import { DeleteSafeBoxUseCase } from './delete-safe-box-usecase';

export default class DeleteSafeBoxController {
  constructor(private deleteSafeBoxUseCase: DeleteSafeBoxUseCase) {}

  async handle(data: IDeleteSafeBoxRequestDTO) {
    try {
      const { message } = await this.deleteSafeBoxUseCase.execute(data);
      return { message };
    } catch (error) {
      return { message: 'nok' };
    }
  }
}
