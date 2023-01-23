/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useState } from 'react';
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
import logoNativeSec from '../../../../../../assets/logoNativesec/512.png';

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
          <button type="button" onClick={handleOpenVerifyNameModal}>
            Deletar
          </button>
        </div>
      </div>
    </>
  );
}
