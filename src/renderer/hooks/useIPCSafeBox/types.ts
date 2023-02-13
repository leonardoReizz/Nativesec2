import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';

export interface IChangeSafeBoxResponse {
  status: number;
  data: {
    status: string;
    msg: any[];
  };
  safeBoxId: string;
}

export interface IDeleteSafeBoxResponse {
  status: number;
  data?: {
    status?: string;
    msg?: any;
    id?: string;
  };
  deletedId?: string;
}

export interface IGetAllSafeBoxResponse {
  safeBoxResponse: boolean;
}

export interface IGetSafeBoxResponse {
  safeBox: ISafeBox;
}

export interface IUpdateUsersSafeBoxResponse {
  message: 'ok' | 'nok';
  data: {
    safeBoxId: string;
  };
}

export interface IAddSafeBoxUsersResponse {
  message: 'ok' | 'nok';
  data: {
    safeBoxId: string;
  };
}

export interface IUpdateSafeBoxResponse {
  message: 'ok' | 'nok';
  data: {
    safeBoxId: string;
  };
}
