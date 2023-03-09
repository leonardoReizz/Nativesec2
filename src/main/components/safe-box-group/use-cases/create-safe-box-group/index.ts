import { SafeBoxGroupRepositoryAPI } from "../../repositories/safe-box-group-repository-API"
import { SafeBoxGroupRepositoryDatabase } from "../../repositories/safe-box-group-repository-database"
import { CreateSafeBoxGroupController } from "./create-safe-box-group-controller"
import { CreateSafeBoxGroupUseCase } from "./create-safe-box-group-use-case"

const safeBoxGroupRepositoryAPI = new  SafeBoxGroupRepositoryAPI()
const safeBoxGroupRepositoryDatabase = new  SafeBoxGroupRepositoryDatabase()


const createSafeBoxGroupUseCase = new CreateSafeBoxGroupUseCase(safeBoxGroupRepositoryAPI, safeBoxGroupRepositoryDatabase);
const createSafeBoxGroupController = new CreateSafeBoxGroupController(createSafeBoxGroupUseCase);

export { createSafeBoxGroupController }
