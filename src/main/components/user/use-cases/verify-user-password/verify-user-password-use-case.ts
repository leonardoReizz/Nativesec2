export class VerifyUserPassword {
  constructor() {}

  async execute() {


  }
  export async function verifyDatabasePassword() {
    const { myEmail, safetyPhrase } = store.get('user') as IUser;
    const { PATH } = store.get('initialData') as IInitialData;
    if (fs.existsSync(`${PATH}/database/default/${md5(myEmail)}.sqlite3`)) {
      const db = await database.CreateDatabase({ myEmail, PATH });
      const verify: any = await DB.verifyPasswordDB({ db, secret: safetyPhrase });
      if (verify.errno === 26) {
        return {
          response: IPCTypes.VERIFY_DATABASE_PASSWORD_RESPONSE,
          data: {
            status: verify.errno,
            data: {
              data: 'nok',
            },
          },
        };
      }
     
  }
  
}