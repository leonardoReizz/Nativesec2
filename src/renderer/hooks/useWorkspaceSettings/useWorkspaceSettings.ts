import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import browserImageSize from 'browser-image-size';

import { toastOptions } from 'renderer/utils/options/Toastify';
import { useDropzone } from 'react-dropzone';
import {
  deleteOrganizationIPC,
  leaveOrganizationIPC,
  updateOrganizationIPC,
} from '@/renderer/services/ipc/Organization';
import settingsSchema from '../../utils/Formik/SettingsOrganizations/settingsOrganization';
import { useLoading } from '../useLoading';
import { useOrganization } from '../useOrganization/useOrganization';
import { useUserConfig } from '../useUserConfig/useUserConfig';

export function useWorkspaceSettings() {
  const { theme } = useUserConfig();
  const { email } = window.electron.store.get('user') as IUser;

  const { currentOrganization, currentOrganizationIcon, isParticipant } =
    useOrganization();
  const { updateLoading, loading } = useLoading();
  const [isOpenVerifyModal, setIsOpenVerifyModal] = useState<boolean>(false);
  const [isOpenVerifyModalLeave, setIsOpenVerifyModalLeave] =
    useState<boolean>(false);
  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const openVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(true);
  }, []);
  const openVerifyModalLeave = useCallback(() => {
    setIsOpenVerifyModalLeave(true);
  }, []);
  const closeOpenVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(false);
  }, []);

  const closeOpenVerifyModalLeave = useCallback(() => {
    setIsOpenVerifyModalLeave(false);
  }, []);

  const closeVerifyModal = useCallback(() => {
    setIsOpenVerifyModal(false);
  }, []);

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
          updateOrganizationIPC({
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

  const { getRootProps } = useDropzone({
    onDrop,
  });

  const verifyDeleteOrganization = useCallback(
    (verified: boolean) => {
      if (verified && currentOrganization) {
        updateLoading(true);
        deleteOrganizationIPC(currentOrganization._id);
      }
    },
    [currentOrganization]
  );

  const verifyRemoveImage = useCallback(
    (verified: boolean) => {
      if (verified && currentOrganization) {
        updateLoading(true);
        updateOrganizationIPC({
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
      updateOrganizationIPC({
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

  const verifyOrganizationLeave = useCallback(() => {
    if (currentOrganization) {
      updateLoading(true);
      leaveOrganizationIPC(currentOrganization._id);
    }
  }, [currentOrganization]);

  return {
    formikProps,
    openVerifyNameModal,
    openVerifyModal,
    openVerifyModalLeave,
    isOpenVerifyModal,
    isOpenVerifyModalLeave,
    isOpenVerifyNameModal,
    closeOpenVerifyNameModal,
    verifyDeleteOrganization,
    verifyRemoveImage,
    closeVerifyModal,
    closeOpenVerifyModalLeave,
    discard,
    verifyOrganizationLeave,
    theme,
    currentOrganization,
    currentOrganizationIcon,
    isParticipant,
    email,
    loading,
    getRootProps,
  };
}
