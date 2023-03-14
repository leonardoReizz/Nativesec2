/* eslint-disable react/require-default-props */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useFormik } from 'formik';
import { IUser } from 'main/types';
import ReactModal from 'react-modal';
import * as Yup from 'yup';
import { Input } from 'renderer/components/Inputs/Input';
import { verifyNameValues } from 'renderer/utils/Formik/VerifyName/verifyName';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Button } from 'renderer/components/Buttons/Button';
import styles from './styles.module.sass';

interface VerifySafetyPhraseModalProps {
  title: string;
  nameToVerify: string | undefined | null;
  isOpen: boolean;
  isLoading?: boolean;
  inputText: string;
  onRequestClose: () => void;
  callback: (verified: boolean) => void;
}

export function VerifyNameModal({
  title,
  nameToVerify,
  isOpen,
  inputText,
  callback,
  onRequestClose,
  isLoading = false,
}: VerifySafetyPhraseModalProps) {
  const { theme } = useUserConfig();
  const user = window.electron.store.get('user') as IUser;

  function handleSubmit() {
    callback(true);
  }

  const verifyNameSchema = Yup.object().shape({
    name: Yup.string()
      .required('Nome não pode ficar em branco.')
      .max(252)
      .oneOf([nameToVerify, null], 'Senha Invalida'),
    safetyPhrase: Yup.string()
      .required('Frase de segurança não pode ficar em branco.')
      .min(12, 'Frase de segurança Inválida.')
      .max(32)
      .oneOf([user ? user.safetyPhrase : '', null], 'Senha Invalida'),
  });

  const formikProps = useFormik({
    initialValues: verifyNameValues,
    onSubmit: () => handleSubmit(),
    validationSchema: verifyNameSchema,
  });

  useEffect(() => {
    formikProps.resetForm();
  }, [isOpen]);

  useEffect(() => {
    if (!isLoading) {
      onRequestClose();
    }
  }, [isLoading]);

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        overlayClassName={styles.reactModalOverlay}
        className={`${styles.reactModalContent} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <h3>{title}</h3>
        <h3>{nameToVerify} ?</h3>
        <form onSubmit={formikProps.handleSubmit}>
          <Input
            text={inputText}
            name="name"
            value={formikProps.values.name}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            viewBarError
            touched
            messageError={formikProps.errors.name}
            theme={theme}
          />
          <Input
            text="Frase Secreta"
            name="safetyPhrase"
            type="password"
            value={formikProps.values.safetyPhrase}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            viewBarError
            touched
            messageError={formikProps.errors.safetyPhrase}
            theme={theme}
          />
          <div className={styles.buttons}>
            <Button
              text="Confirmar"
              isLoading={isLoading}
              type="submit"
              theme={theme}
            />
            <Button
              text="Cancelar"
              type="button"
              color="red"
              theme={theme}
              onClick={onRequestClose}
            />
          </div>
        </form>
      </ReactModal>
    </>
  );
}
