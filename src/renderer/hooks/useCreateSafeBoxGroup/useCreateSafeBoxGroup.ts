import { OrganizationsContext } from '@/renderer/contexts/OrganizationsContext/OrganizationsContext';
import { useFormik } from 'formik';
import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export function useCreateSafeBoxGroup() {
  const { currentOrganization } = useContext(OrganizationsContext);
  const navigate = useNavigate();
  const initialValues = {
    name: '',
    description: '',
  };

  function handleSubmit(values: typeof initialValues) {}

  const formikProps = useFormik({
    initialValues,
    onSubmit: (values) => handleSubmit(values),
  });

  const handleCancel = useCallback(() => {
    navigate(`/workspace/${currentOrganization?._id}`);
  }, []);

  return { formikProps, handleCancel };
}
