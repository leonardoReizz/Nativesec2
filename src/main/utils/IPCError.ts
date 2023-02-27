import { store } from '../main';

interface IPCErrorData {
  object: APIResponse | Error | true | any;
  message: string;
  type: 'api' | 'database';
}

export function IPCError({
  object,
  message,
  type,
}: IPCErrorData): Error | true {
  if (object === true) return true;

  if (type === 'database') {
    if (object instanceof Error)
      throw new Error(
        `${(store.get('user') as IUser)?.email}: ${message}, ${JSON.stringify(
          object
        )}`
      );
  } else if (object?.status !== 200 || object?.data?.status !== 'ok')
    throw new Error(
      `${(store.get('user') as IUser)?.email}: ${message}, ${JSON.stringify(
        object
      )}`
    );

  return true;
}
