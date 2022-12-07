/* eslint-disable react/jsx-no-bind */
import { Input } from 'renderer/components/Inputs/Input';
import { Button } from 'renderer/components/Buttons/Button';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { FormMessageError } from 'renderer/components/FormMessageError';
import {
  LoginInitialValues,
  LoginSchema,
} from 'renderer/utils/Formik/Login/Login';
import { useAuth } from 'renderer/hooks/useAuth/useAuth';
import styles from './styles.module.sass';
import nativeSecLogo from '../../../../../assets/logoNativesec/brand-nativesec.svg';
import { AuthStateType } from '..';
import { Token } from './Token';
import { SearchKey } from './SearchKey';

interface LoginProps {
  handleAuthState: (state: AuthStateType) => void;
  changeLoadingState: (state: boolean) => void;
  authState: AuthStateType;
}

type SubmitFormType = typeof LoginInitialValues;

export function Login({
  authState,
  handleAuthState,
  changeLoadingState,
}: LoginProps) {
  const { AuthPassword } = useAuth();
  const [buttonIsLoading, setButtonIsLoading] = useState<boolean>(false);

  function handleSubmit(values: SubmitFormType) {
    setButtonIsLoading(true);
    AuthPassword({ email: values.email });
  }

  useEffect(() => {
    setButtonIsLoading(false);
  }, [authState]);

  const formikProps = useFormik({
    initialValues: LoginInitialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: LoginSchema,
  });

  return (
    <div className={styles.login}>
      <img src={nativeSecLogo} alt="" />
      {authState === 'login' ? (
        <form onSubmit={formikProps.handleSubmit}>
          <div>
            <Input
              type="text"
              text="Email"
              name="email"
              value={formikProps.values.email}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              isValid={
                !(
                  Boolean(formikProps.errors.email) && formikProps.touched.email
                )
              }
            />
            <FormMessageError
              message={formikProps.errors.email}
              touched={formikProps.touched.email}
            />
          </div>
          <Button
            type="submit"
            text="Gerar Token"
            isLoading={buttonIsLoading}
          />
        </form>
      ) : authState === 'token' ? (
        <Token changeLoadingState={changeLoadingState} />
      ) : authState === 'searchKey' ? (
        <SearchKey changeLoadingState={changeLoadingState} />
      ) : (
        <></>
      )}
    </div>
  );
}
