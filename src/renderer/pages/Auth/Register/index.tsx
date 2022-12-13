/* eslint-disable react/jsx-no-bind */
import { Button } from 'renderer/components/Buttons/Button';
import { Input } from 'renderer/components/Inputs/Input';
import {
  RegisterInitialValues,
  RegisterSchema,
} from 'renderer/utils/Formik/Register/Register';
import { useFormik } from 'formik';
import { FormMessageError } from 'renderer/components/Forms/FormMessageError';
import { AuthStateType } from '..';
import styles from './styles.module.sass';
import nativeSecLogo from '../../../../../assets/logoNativesec/brand-nativesec.svg'


interface RegisterProps {
  authState: AuthStateType;
  changeAuthState: (state: AuthStateType) => void;
}

type RegisterFormType = typeof RegisterInitialValues;

export function Register({ authState, changeAuthState }: RegisterProps) {
  function handleSubmit(values: RegisterFormType) {
    console.log(values);
  }

  function handleRegisterStepTwo() {
    changeAuthState('register-step-two');
  }

  const formikProps = useFormik({
    initialValues: RegisterInitialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: RegisterSchema,
  });

  return (
    <div className={styles.register}>
      <img src={nativeSecLogo} alt="" />
      <div
        className={`${styles.registerContainer} ${
          authState === 'register-step-two' ? styles.stepTwo : ''
        }`}
      >
        <form action="#" className={styles.register}>
          <div>
            <Input
              text="Nome Completo"
              name="fullName"
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
            />
            <FormMessageError
              message={formikProps.errors.fullName}
              touched={formikProps.touched.fullName}
            />
          </div>
          <div>
            <Input
              text="Email"
              name="email"
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
            />
            <FormMessageError
              message={formikProps.errors.email}
              touched={formikProps.touched.email}
            />
          </div>
          <div>
            <Input
              text="Frase Secreta"
              name="safetyPhrase"
              type="password"
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
            />
            <FormMessageError
              message={formikProps.errors.safetyPhrase}
              touched={formikProps.touched.safetyPhrase}
            />
          </div>
          <div>
            <Input
              text="Confirme a Frase Secreta"
              name="confirmSafetyPhrase"
              type="password"
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
            />
            <FormMessageError
              message={formikProps.errors.confirmSafetyPhrase}
              touched={formikProps.touched.confirmSafetyPhrase}
            />
          </div>
          <Button text="Criar conta" />
        </form>
        <div className={styles.buttonStart}>
          <Button
            type="button"
            text="Crie uma conta"
            onClick={handleRegisterStepTwo}
          />
        </div>
      </div>
    </div>
  );
}
