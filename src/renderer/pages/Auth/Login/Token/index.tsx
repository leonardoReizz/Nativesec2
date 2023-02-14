import { useFormik } from 'formik';
import { IUser } from 'main/types';
import { toast } from 'react-toastify';
import { Button } from 'renderer/components/Buttons/Button';
import { FormMessageError } from 'renderer/components/Forms/FormMessageError';
import { Input } from 'renderer/components/Inputs/Input';
import { useAuth } from 'renderer/hooks/useAuth/useAuth';
import { LoadingType } from 'renderer/routes';
import {
  TokenInitialValues,
  TokenSchema,
} from 'renderer/utils/Formik/Token/Token';

import styles from './styles.module.sass';

interface TokenProps {
  changeLoadingState: (state: LoadingType) => void;
}

type SubmitFormType = typeof TokenInitialValues;

export function Token({ changeLoadingState }: TokenProps) {
  const { AuthPassword, AuthLogin } = useAuth();

  function handleSubmit(values: SubmitFormType) {
    toast.dismiss('sendToken');
    window.electron.store.set('user', {
      ...(window.electron.store.get('user') as IUser),
      safetyPhrase: values.safetyPhrase,
    });
    AuthLogin({ token: values.token });
    changeLoadingState('true');
  }

  function handleResendToken() {
    const { email } = window.electron.store.get('user') as IUser;
    AuthPassword({ email });
  }

  const formikProps = useFormik({
    initialValues: TokenInitialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: TokenSchema,
  });

  return (
    <div className={styles.token}>
      <form onSubmit={formikProps.handleSubmit}>
        <div>
          <Input
            text="Token"
            type="password"
            name="token"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
          />
          <FormMessageError
            message={formikProps.errors.token}
            touched={formikProps.touched.token}
          />
        </div>
        <div>
          <Input
            text="Frase Secreta"
            type="password"
            name="safetyPhrase"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
          />
          <FormMessageError
            message={formikProps.errors.safetyPhrase}
            touched={formikProps.touched.safetyPhrase}
          />
        </div>
        <Button
          text="Entrar"
          type="submit"
          className={styles.blue}
          color="blue"
        />
      </form>

      <button
        type="button"
        className={styles.resendToken}
        onClick={handleResendToken}
      >
        Reenviar Token
      </button>
    </div>
  );
}
