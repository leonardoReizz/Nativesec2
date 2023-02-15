/* eslint-disable react/require-default-props */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useFormik } from 'formik';
import ReactModal from 'react-modal';
import * as Yup from 'yup';
import { Input } from 'renderer/components/Inputs/Input';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Button } from 'renderer/components/Buttons/Button';
import { Dropdown } from '../../Dropdown';
import styles from './styles.module.sass';

interface FieldModalWithDropdownProps {
  title: string;
  isOpen: boolean;
  inputText: string;
  onRequestClose: () => void;
  callback: (user: any) => void;
  options: any;
  loading?: boolean;
}

export function FieldModalWithDropdown({
  title,
  isOpen,
  inputText,
  callback,
  onRequestClose,
  options,
  loading = false,
}: FieldModalWithDropdownProps) {
  const { theme } = useUserConfig();

  function handleSubmit(values: typeof verifyEmailInitialValues) {
    callback(values);
  }

  function handleCloseModal() {
    onRequestClose();
  }

  const verifyEmailInitialValues = {
    email: '',
    type: { id: 1, value: 'guestParticipant', label: 'Participante' },
  };

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

  useEffect(() => {
    if (!loading) onRequestClose();
  }, [loading]);

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
          <Dropdown
            theme={theme}
            options={options}
            onChange={(value) => formikProps.setFieldValue('type', value)}
            value={formikProps.values.type?.label}
            text="Nivel de acesso"
          />
          <Input
            text={inputText}
            name="email"
            value={formikProps.values.email}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            viewBarError
            theme={theme}
            touched
            messageError={formikProps.errors.email}
          />
          <div className={styles.buttons}>
            <Button
              text="Confirmar"
              type="submit"
              theme={theme}
              isLoading={loading}
            />
            <Button
              text="Cancelar"
              type="submit"
              onClick={handleCloseModal}
              color="red"
              theme={theme}
            />
          </div>
        </form>
      </ReactModal>
    </>
  );
}
