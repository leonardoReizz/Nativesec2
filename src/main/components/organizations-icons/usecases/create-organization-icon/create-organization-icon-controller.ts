import { CreateOrganizationIconUseCase } from './create-organization-icon-usecase';
import { ICreateOrganizationIconRequestDTO } from './create-organziation-icon-dto';

export class CreateOrganizationIconController {
  constructor(
    private createOrganizationIconUseCase: CreateOrganizationIconUseCase
  ) {}

  async execute(data: ICreateOrganizationIconRequestDTO) {
    await this.createOrganizationIconUseCase.execute(data);
  }
}
