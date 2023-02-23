import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { IChangeSafetyPhraseRequestDTO } from './change-safety-phrase-request-dto';
import { ChangeSafetyPhraseUseCase } from './change-safety-phrase-use-case';
import '@sentry/tracing';

export class ChangeSafetyPhraseController {
  constructor(private changeSafetyPhraseUseCase: ChangeSafetyPhraseUseCase) {}

  async handle(data: IChangeSafetyPhraseRequestDTO) {
    const message = await this.changeSafetyPhraseUseCase.execute(data);
    try {
      return {
        response: IPCTypes.CHANGE_SAFETY_PHRASE_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.CHANGE_SAFETY_PHRASE_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
