import { toastOptions } from '@/renderer/utils/options/Toastify';
import { IPCTypes } from '@/types/IPCTypes';
import { useFormik } from 'formik';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import formik from '../../utils/Formik/formik';
import { useCreateSafeBox } from '../useCreateSafeBox/useCreateSafeBox';
import { useOrganization } from '../useOrganization/useOrganization';
import { useUserConfig } from '../useUserConfig/useUserConfig';
import * as types from './types';

export function useCreateSafeBoxComponentT() {
  const { formikIndex, changeFormikIndex } = useCreateSafeBox();

  const { currentOrganization } = useOrganization();
  const { theme } = useUserConfig();

  function getInitialValues() {
    return formik[formikIndex].item.map((item: types.IFormikItem) => {
      item[`${item.name}`] = '';
      return item;
    });
  }
  const initialValues = getInitialValues();

  function handleSubmit(values: any) {
    if (currentOrganization) {
      toast.loading('Salvando...', { ...toastOptions, toastId: 'saveSafeBox' });
      const { email } = window.electron.store.get('user') as IUser;
      const size = values.length;
      const content = [];
      for (let i = 1; i < size - 1; i += 1) {
        content.push({
          [values[i]?.name as string]: values[i][`${values[i].name}`],
          crypto: values[i].crypto,
          name: values[i].name,
        });
      }

      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.CREATE_SAFE_BOX,
        data: {
          usuarios_leitura: [],
          usuarios_escrita: [email],
          tipo: formik[formikIndex].type,
          usuarios_leitura_deletado: [],
          usuarios_escrita_deletado: [],
          criptografia: 'rsa',
          nome: values[0][`${values[0].name}`],
          descricao: values[size - 1][`${values[size - 1].name}`],
          conteudo: content,
          organizacao: currentOrganization._id,
        },
      });
    }
  }

  const formikProps = useFormik({
    initialValues,
    onSubmit: (values) => handleSubmit(values),
    enableReinitialize: true,
  });

  return { formikIndex, changeFormikIndex, theme, formikProps };
}
