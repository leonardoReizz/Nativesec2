import { KeyRepositoryAPI } from '@/main/components/keys/repositories/key-repository-api';
import { KeyRepositoryDatabase } from '@/main/components/keys/repositories/key-repository-database';
import { ChangeSafetyPhraseController } from './change-safety-phrase-controller';
import { ChangeSafetyPhraseUseCase } from './change-safety-phrase-use-case';

const keyRepositoryAPI = new KeyRepositoryAPI();
const keyRepositoryDatabase = new KeyRepositoryDatabase();

const changeSafetyPhraseUseCase = new ChangeSafetyPhraseUseCase(
  keyRepositoryAPI,
  keyRepositoryDatabase
);

const changeSafetyPhraseController = new ChangeSafetyPhraseController(
  changeSafetyPhraseUseCase
);

export { changeSafetyPhraseController };
