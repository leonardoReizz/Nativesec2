/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';
import { BsFillTrashFill } from 'react-icons/bs';

import browserImageSize from 'browser-image-size';

import { Button } from 'renderer/components/Buttons/Button';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { useLoading } from 'renderer/hooks/useLoading';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';

import { useDropzone } from 'react-dropzone';
import { VerifyModal } from 'renderer/components/Modals/VerifyModal';
import { toast } from 'react-toastify';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { Input } from 'renderer/components/Inputs/Input';
import { TextArea } from 'renderer/components/TextAreas/TextArea';

import { IoExit } from 'react-icons/io5';
import { IUser } from 'main/types';
import { useFormik } from 'formik';
import logoNativeSec from '../../../../../../assets/logoNativesec/512.png';
import settingsSchema from '../../../../utils/Formik/SettingsOrganizations/settingsOrganization';

import styles from './styles.module.sass';

export function Settings() {
  const { theme } = useUserConfig();
  const {
    currentOrganization,
    currentOrganizationIcon,
    deleteOrganization,
    updateOrganization,
  } = useOrganization();
  const { updateLoading, loading } = useLoading();
  const { myEmail } = window.electron.store.get('user') as IUser;
  const [isOpenVerifyModal, setIsOpenVerifyModal] = useState<boolean>(false);
  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);
  async function handleOpenVerifyNameModal() {
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

  const { getRootProps } = useDropzone({
    onDrop,
  });

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

  function handleOpenVerifyModal() {
    setIsOpenVerifyModal(true);
  }

  function handleSubmit(
    values: typeof settingsSchema.SettingsOrganizationInitialValues
  ) {}

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

  return (
    <>
      <VerifyNameModal
        inputText="Nome da organizacao"
        isOpen={isOpenVerifyNameModal}
        onRequestClose={closeOpenVerifyNameModal}
        nameToVerify={currentOrganization?.nome}
        callback={verifyDeleteOrganization}
        title="Tem certeza que deseja excluir"
        isLoading={loading}
      />
      <VerifyModal
        title="Tem certeza que deseja remover a imagem da organização?"
        isOpen={isOpenVerifyModal}
        onRequestClose={closeVerifyModal}
        theme={theme}
        callback={verifyRemoveImage}
      />
      <div
        className={`${styles.settings} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <div className={styles.settingsContainer}>
          <div className={styles.image}>
            <img
              src={
                currentOrganizationIcon &&
                currentOrganizationIcon?.icone !== 'null'
                  ? currentOrganizationIcon.icone
                  : logoNativeSec
              }
              alt=""
            />
            <div className={styles.title}>
              <h3>Altere a imagem da Organização</h3>
              <span>Tamanho maximo 512x512</span>
            </div>
            <div className={styles.actions}>
              <div {...getRootProps()}>
                <Button Icon={<FaCamera />} text="Selecionar" />
              </div>
              <Button
                Icon={<BsFillTrashFill />}
                text="Remover"
                className={styles.red}
                onClick={handleOpenVerifyModal}
              />
            </div>
          </div>

          <div className={styles.form}>
            <form action="">
              <Input
                name="name"
                text="Nome"
                value={formikProps.values.name}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                theme={theme}
              />
              <TextArea
                name="description"
                text="Descrição"
                value={formikProps.values.description}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                theme={theme}
              />

              <div className={styles.actions}>
                <Button
                  type="submit"
                  text="Salvar"
                  disabled={
                    currentOrganization?.nome === formikProps.values.name &&
                    currentOrganization?.descricao ===
                      formikProps.values.description
                  }
                />
                <Button type="button" text="Descartar" className={styles.red} />
              </div>
            </form>
          </div>

          <div className={styles.separator}>
            <span>Ações</span>
          </div>

          <div className={styles.organizationActions}>
            <div className={styles.item}>
              <div>
                <h3>Deletar Organização</h3>
                <span>
                  Essa ação irá excluir todos cofres, usuarios e configurações
                  desse workspace tal ação não poderá ser revertida{' '}
                </span>
              </div>
              <Button text="Deletar Workspace" Icon={<BsFillTrashFill />} />
            </div>
            <div className={styles.item}>
              <div>
                <h3>Sair da Organização</h3>
                <span>
                  Essa ação irá excluir todos cofres, usuarios e configurações
                  desse workspace tal ação não poderá ser revertida{' '}
                </span>
              </div>
              <Button
                text="Sair do Workspace"
                Icon={<IoExit />}
                disabled={currentOrganization?.dono === myEmail}
              />
            </div>
          </div>

          {/* deletar workspace */}
          {/* <button type="button" onClick={handleOpenVerifyNameModal}>
            Deletar
          </button> */}
        </div>
      </div>
    </>
  );
}
