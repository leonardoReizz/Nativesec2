import { CreateSafeBoxRequestDTO } from './create-safe-box-request-dto';
import { CreateSafeBoxUseCase } from './create-safe-box-usecase';

export class CreateSafeBoxController {
  constructor(private createSafeBoxUseCase: CreateSafeBoxUseCase) {}

  async handle(data: CreateSafeBoxRequestDTO) {
    try {
      console.log(data);
      await this.createSafeBoxUseCase.execute(data);
      return { message: 'ok' };
    } catch (error: any) {
      return { message: error.message };
    }
  }
}
