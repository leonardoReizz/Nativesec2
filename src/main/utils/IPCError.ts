import { store } from '../main';

interface IPCErrorData {
  object: APIResponse | Error | true | any;
  message: string;
}

export function IPCError({ object, message }: IPCErrorData): Error | true {
  if (object === true) return true;
  if (object instanceof Error)
    throw new Error(
      `${(store.get('user') as IUser)?.email}: ${message}, ${JSON.stringify(
        object
      )}`
    );

  if (object?.status !== 200 || object?.data?.status !== 'ok')
    throw new Error(
      `${(store.get('user') as IUser)?.email}: ${message}, ${JSON.stringify(
        object
      )}`
    );

  return true;
}
