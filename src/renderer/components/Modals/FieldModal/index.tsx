/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useFormik } from 'formik';
import ReactModal from 'react-modal';
import * as Yup from 'yup';
import { Input } from 'renderer/components/Inputs/Input';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import styles from './styles.module.sass';

interface FieldModalProps {
  title: string;
  isOpen: boolean;
  inputText: string;
  onRequestClose: () => void;
  callback: (email: string) => void;
}

export function FieldModal({
  title,
  isOpen,
  inputText,
  callback,
  onRequestClose,
}: FieldModalProps) {
  const { theme } = useUserConfig();

  function handleSubmit(values: typeof verifyEmailInitialValues) {
    callback(values.email);
    onRequestClose();
  }

  function handleCloseModal() {
    onRequestClose();
  }

  const verifyEmailInitialValues = { email: '' };
  const verifyEmailSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required('Email não pode ficar em branco.')
      .max(252),
  });

  const formikProps = useFormik({
    initialValues: verifyEmailInitialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: verifyEmailSchema,
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
        <h3>{title}</h3>
        <form onSubmit={formikProps.handleSubmit}>
          <Input
            text={inputText}
            name="email"
            value={formikProps.values.email}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            viewBarError
            touched
            messageError={formikProps.errors.email}
          />
          <div className={styles.buttons}>
            <button type="submit">
              <span>Confirmar</span>
            </button>
            <button type="button" onClick={handleCloseModal}>
              <span>Cancelar</span>
            </button>
          </div>
        </form>
      </ReactModal>
    </>
  );
}
