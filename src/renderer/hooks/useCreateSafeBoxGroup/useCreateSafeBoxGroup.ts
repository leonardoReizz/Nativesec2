import { OrganizationsContext } from '@/renderer/contexts/OrganizationsContext/OrganizationsContext';
import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import {
  createSafeBoxGroupIPC,
  updateSafeBoxGroupIPC,
} from '@/renderer/services/ipc/SafeBoxGroup';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import { useFormik } from 'formik';
import { useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

interface IUseSafeBoxGroupModalProps {
  open: boolean;
  closeCreateSafeBoxGroupModal: () => void;
  edit?: {
    safeBoxGroup: ISafeBoxGroup;
  };
}

export function useCreateSafeBoxGroup({
  open,
  closeCreateSafeBoxGroupModal,
  edit,
}: IUseSafeBoxGroupModalProps) {
  const { currentOrganization } = useContext(OrganizationsContext);
  const navigate = useNavigate();

  const initialValues = edit?.safeBoxGroup
    ? {
        name: edit.safeBoxGroup.nome,
        description: edit.safeBoxGroup.descricao,
      }
    : {
        name: '',
        description: '',
      };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required().max(122),
    description: Yup.string().max(255),
  });

  function handleSubmit(values: typeof initialValues) {
    if (currentOrganization) {
      closeCreateSafeBoxGroupModal();
      if (edit?.safeBoxGroup) {
        updateSafeBoxGroupIPC({
          ...values,
          id: edit.safeBoxGroup._id,
          organization: edit.safeBoxGroup.organizacao,
          safeboxes: JSON.parse(edit.safeBoxGroup.cofres),
        });
      } else {
        toast.loading('Salvando...', {
          ...toastOptions,
          toastId: 'createSafeBoxGroup',
        });
        createSafeBoxGroupIPC({
          ...values,
          safeBoxes: [],
          organization: currentOrganization._id,
        });
      }
    }
  }

  const formikProps = useFormik({
    initialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema,
    enableReinitialize: true,
  });

  const handleCancel = useCallback(() => {
    navigate(`/workspace/${currentOrganization?._id}`);
  }, []);

  useEffect(() => {
    formikProps.resetForm();
  }, [open]);

  return { formikProps, handleCancel };
}
