import { EditSafeBoxUseCase } from './edit-safe-box-use-case';

export class EditSafeBoxController {
  constructor(private editSafeBoxUseCase: EditSafeBoxUseCase) {}

  async handle() {
    this.editSafeBoxUseCase.execute();
  }
}
