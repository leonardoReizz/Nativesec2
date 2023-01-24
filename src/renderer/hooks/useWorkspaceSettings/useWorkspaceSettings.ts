import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import browserImageSize from 'browser-image-size';

import { toastOptions } from 'renderer/utils/options/Toastify';
import settingsSchema from '../../utils/Formik/SettingsOrganizations/settingsOrganization';
import { useLoading } from '../useLoading';
import { useOrganization } from '../useOrganization/useOrganization';

export function useWorkspaceSettings() {
  const {
    currentOrganization,
    currentOrganizationIcon,
    deleteOrganization,
    updateOrganization,
  } = useOrganization();
  const { updateLoading } = useLoading();
  const [isOpenVerifyModal, setIsOpenVerifyModal] = useState<boolean>(false);
  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);

  async function openVerifyNameModal() {
    setIsOpenVerifyNameModal(true);
  }

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const closeOpenVerifyNameModal = () => {
    setIsOpenVerifyNameModal(false);
  };

  const onDrop = useCallback(async (acceptedFiles: any) => {
    toast.dismiss('invalidSize');
    toast.dismiss('invalidFormat');

    if (
      acceptedFiles[0].type === 'image/png' ||
      acceptedFiles[0].type === 'image/jpeg' ||
      acceptedFiles[0].type === 'image/jpg'
    ) {
      const imageSize = await browserImageSize(acceptedFiles[0]).then(
        (result: any) => {
          return result;
        }
      );
      if (imageSize.width > 512 || imageSize.height > 512) {
        toast.error('Tamanho máximo valido: 512 x 512', {
          ...toastOptions,
          toastId: 'invalidSize',
        });
      } else {
        const base64 = (await toBase64(acceptedFiles[0])) as string;
        if (currentOrganization && base64) {
          updateOrganization({
            organizationId: currentOrganization._id,
            name: currentOrganization.nome,
            description: currentOrganization.descricao,
            icon: base64,
            theme: currentOrganization.tema,
          });
        }
      }
    } else {
      toast.error('Formatos validos: PNG, JPEG e JPG', {
        ...toastOptions,
        toastId: 'invalidFormat',
      });
    }
  }, []);

  const closeVerifyModal = useCallback(() => {
    setIsOpenVerifyModal(false);
  }, []);

  const verifyDeleteOrganization = useCallback(
    (verified: boolean) => {
      if (verified && currentOrganization) {
        updateLoading(true);
        deleteOrganization(currentOrganization?._id);
      }
    },
    [currentOrganization]
  );

  const verifyRemoveImage = useCallback(
    (verified: boolean) => {
      if (verified && currentOrganization) {
        updateOrganization({
          organizationId: currentOrganization._id,
          name: currentOrganization.nome,
          description: currentOrganization.descricao,
          icon: 'null',
          theme: currentOrganization.tema,
        });
      }
    },
    [currentOrganization]
  );

  function openVerifyModal() {
    setIsOpenVerifyModal(true);
  }

  function handleSubmit(
    values: typeof settingsSchema.SettingsOrganizationInitialValues
  ) {
    if (currentOrganization && currentOrganizationIcon) {
      updateOrganization({
        name: values.name,
        description: values.description,
        organizationId: currentOrganization?._id,
        icon: currentOrganizationIcon?.icone,
        theme: currentOrganization.tema,
      });
    }
  }

  const formikProps = useFormik({
    initialValues: settingsSchema.SettingsOrganizationInitialValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: settingsSchema.SettingsOrganizationSchema,
  });

  useEffect(() => {
    if (currentOrganization) {
      formikProps.setFieldValue('name', currentOrganization.nome);
      formikProps.setFieldValue('description', currentOrganization.descricao);
    }
  }, []);

  const discard = useCallback(() => {
    if (currentOrganization) {
      formikProps.setFieldValue('name', currentOrganization?.nome);
      formikProps.setFieldValue('description', currentOrganization?.descricao);
    }
  }, [currentOrganization, formikProps]);

  return {
    formikProps,
    openVerifyNameModal,
    openVerifyModal,
    isOpenVerifyModal,
    isOpenVerifyNameModal,
    closeOpenVerifyNameModal,
    verifyDeleteOrganization,
    verifyRemoveImage,
    closeVerifyModal,
    onDrop,
    discard,
  };
}
