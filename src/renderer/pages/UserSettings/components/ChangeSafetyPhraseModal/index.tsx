import { IUser } from '@/main/types';
import { Button } from '@/renderer/components/Buttons/Button';
import { Input } from '@/renderer/components/Inputs/Input';
import { useLoading } from '@/renderer/hooks/useLoading';
import { IPCTypes } from '@/types/IPCTypes';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import ReactModal from 'react-modal';
import * as Yup from 'yup';
import styles from './styles.module.sass';

interface ChangeSafetyPhraseModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  callback: () => void;
  theme: ThemeType;
}
export function ChangeSafetyPhraseModal({
  isOpen,
  onRequestClose,
  callback,
  theme,
}: ChangeSafetyPhraseModalProps) {
  const { loading, updateLoading } = useLoading();
  const user = window.electron.store.get('user') as IUser;

  const verirySafetyPhraseSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .required('Preencha todos os campos')
      .min(12, 'Senha Atual Invalida')
      .max(32)
      .oneOf([user ? user.safetyPhrase : '', null], 'Senha Atual Invalida'),
    newPassword: Yup.string()
      .required('Preencha todos os campos')
      .min(12, 'Nova senha deve conter no minimo 12 caracteres.')
      .max(32),
    confirmNewPassword: Yup.string()
      .required('Preencha todos os campos')
      .min(12, 'Nova senha Invalida')
      .max(32)
      .oneOf([Yup.ref('newPassword'), null], 'Nova Senha Invalida'),
  });

  function handleSubmit(values: any) {
    updateLoading(true);
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.CHANGE_SAFETY_PHRASE,
      data: {
        newSecret: values.newPassword,
      },
    });
  }

  const formikProps = useFormik({
    initialValues: { oldPassword: '', newPassword: '', confirmNewPassword: '' },
    onSubmit: (values) => handleSubmit(values),
    validationSchema: verirySafetyPhraseSchema,
  });

  useEffect(() => {
    formikProps.resetForm();
  }, [isOpen]);

  useEffect(() => {
    if (!loading) {
      onRequestClose();
    }
  }, [loading]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={styles.reactModalOverlay}
      className={`${styles.reactModalContent} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <h3>Alterar Frase Secreta</h3>
      <form onSubmit={formikProps.handleSubmit}>
        <Input
          name="oldPassword"
          value={formikProps.values.oldPassword}
          onChange={formikProps.handleChange}
          onBlur={formikProps.handleBlur}
          touched={formikProps.touched.oldPassword}
          text="Senha Atual"
          type="password"
          viewBarError
          messageError={formikProps.errors.oldPassword}
          theme={theme}
        />
        <Input
          name="newPassword"
          value={formikProps.values.newPassword}
          onChange={formikProps.handleChange}
          onBlur={formikProps.handleBlur}
          touched={formikProps.touched.newPassword}
          text="Nova Senha"
          type="password"
          viewBarError
          messageError={formikProps.errors.newPassword}
          theme={theme}
        />
        <Input
          name="confirmNewPassword"
          value={formikProps.values.confirmNewPassword}
          onChange={formikProps.handleChange}
          onBlur={formikProps.handleBlur}
          touched={formikProps.touched.confirmNewPassword}
          text="Confirme a Nova Senha"
          type="password"
          viewBarError
          messageError={formikProps.errors.confirmNewPassword}
          theme={theme}
        />
        <div className={styles.actions}>
          <span>
            {formikProps.errors.oldPassword
              ? formikProps.errors.oldPassword
              : formikProps.errors.newPassword
              ? formikProps.errors.newPassword
              : formikProps.errors.confirmNewPassword
              ? formikProps.errors.confirmNewPassword
              : ''}
          </span>
          <Button
            type="submit"
            text="Salvar"
            theme={theme}
            isLoading={loading}
          />
          <Button
            type="button"
            text="Cancelar"
            theme={theme}
            onClick={onRequestClose}
            color="red"
          />
        </div>
      </form>
    </ReactModal>
  );
}
