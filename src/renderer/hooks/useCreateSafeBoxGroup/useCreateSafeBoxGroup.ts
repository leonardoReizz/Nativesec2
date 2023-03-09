import { OrganizationsContext } from '@/renderer/contexts/OrganizationsContext/OrganizationsContext';
import { createSafeBoxGroupIPC } from '@/renderer/services/ipc/SafeBoxGroup';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import { useFormik } from 'formik';
import { useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

export function useCreateSafeBoxGroup(
  open: boolean,
  closeCreateSafeBoxGroupModal: () => void
) {
  const { currentOrganization } = useContext(OrganizationsContext);
  const navigate = useNavigate();
  const initialValues = {
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

  const formikProps = useFormik({
    initialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema,
  });

  const handleCancel = useCallback(() => {
    navigate(`/workspace/${currentOrganization?._id}`);
  }, []);

  useEffect(() => {
    formikProps.resetForm();
  }, [open]);

  return { formikProps, handleCancel };
}
