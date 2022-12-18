import { CreateOrganizationIconUseCase } from 'main/components/organizations-icons/usecases/create-organization-icon/create-organization-icon-usecase';
import { ICreateOrganization } from 'main/ipc/organizations/types';
import { CreateOrganizationUseCase } from './create-organization-usecase';

export class CreateOrganizationController {
  constructor(
    private createOrganizationUseCase: CreateOrganizationUseCase,
    private createOrganizationIconUseCase: CreateOrganizationIconUseCase
  ) {}

  async handle(organization: ICreateOrganization) {
    const createOrganization = await this.createOrganizationUseCase.execute(
      organization
    );

    if (createOrganization.created) {
      const createOrganizationIcon =
        await this.createOrganizationIconUseCase.execute({
          organizationId: createOrganization.organization,
        });

      if (createOrganizationIcon) {
        return { created: true };
      }
    }

    return { created: false };
  }
}
