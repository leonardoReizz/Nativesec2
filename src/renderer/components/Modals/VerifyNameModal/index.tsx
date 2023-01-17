/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useFormik } from 'formik';
import { IUser } from 'main/types';
import ReactModal from 'react-modal';
import * as Yup from 'yup';
import { Input } from 'renderer/components/Inputs/Input';
import { verifyNameValues } from 'renderer/utils/Formik/VerifyName/verifyName';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import styles from './styles.module.sass';

interface VerifySafetyPhraseModalProps {
  title: string;
  nameToVerify: string | undefined | null;
  isOpen: boolean;
  inputText: string;
  onRequestClose: () => void;
  verifyName: (verified: boolean) => void;
}

export function VerifyNameModal({
  title,
  nameToVerify,
  isOpen,
  inputText,
  verifyName,
  onRequestClose,
}: VerifySafetyPhraseModalProps) {
  const { theme } = useUserConfig();
  const user = window.electron.store.get('user') as IUser;

  function handleSubmit(values: typeof verifyNameValues) {
    verifyName(true);
    onRequestClose();
  }

  function handleCloseModal() {
    onRequestClose();
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
    onSubmit: (values) => handleSubmit(values),
    validationSchema: verifyNameSchema,
  });

  useEffect(() => {
    formikProps.resetForm();
  }, [isOpen]);

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
        <h2>{title}</h2>
        <h2>{nameToVerify}</h2>
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
          />
          <div className={styles.buttons}>
            <button type="submit">Confirmar</button>
            <button type="button" onClick={handleCloseModal}>
              Cancelar
            </button>
          </div>
        </form>
      </ReactModal>
    </>
  );
}
