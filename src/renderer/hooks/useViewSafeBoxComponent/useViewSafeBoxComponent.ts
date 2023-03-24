import { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { IPCTypes } from '@/types/IPCTypes';
import { toast } from 'react-toastify';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import { IFormikItem } from '@/renderer/contexts/CreateSafeBox/types';
import { updateSafeBoxGroupIPC } from '@/renderer/services/ipc/SafeBoxGroup';
import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { deleteSafeBoxIPC } from '@/renderer/services/ipc/SafeBox';
import { decryptMessageIPC } from '@/renderer/services/ipc/Crypto';
import { useSafeBox } from '../useSafeBox/useSafeBox';
import formik from '../../utils/Formik/formik';
import { useCreateSafeBox } from '../useCreateSafeBox/useCreateSafeBox';
import { useOrganization } from '../useOrganization/useOrganization';
import { useUserConfig } from '../useUserConfig/useUserConfig';
import { useLoading } from '../useLoading';
import { useSafeBoxGroup } from '../useSafeBoxGroup/useSafeBoxGroup';

export function useViewSafeBoxComponent() {
  const { changeFormikIndex } = useCreateSafeBox();
  const { currentOrganization } = useOrganization();
  const { formikIndex } = useCreateSafeBox();
  const {
    currentSafeBox,
    changeSafeBoxMode,
    safeBoxMode,
    changeSafeBoxesIsLoading,
  } = useSafeBox();
  const { safeBoxGroup } = useSafeBoxGroup();
  const { theme } = useUserConfig();
  const { loading, updateLoading } = useLoading();

  const [verifySafetyPhraseType, setVerifySafetyPhraseType] = useState('');
  const [isOpenSharingModal, setIsOpenSharingModal] = useState<boolean>(false);
  const [isOpenVerifySafetyPhrase, setIsOpenVerifySafetyPhrase] =
    useState<boolean>(false);
  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);

  const participantGroups = safeBoxGroup
    .map((group) => {
      const safeboxes = JSON.parse(group.cofres);
      const filter = safeboxes.filter(
        (safeboxId: string) => safeboxId === currentSafeBox?._id
      );
      if (filter[0]) {
        return group;
      }

      return undefined;
    })
    .filter((group) => group !== undefined);

  function getInitialValues() {
    return formik[formikIndex].item.map((item: IFormikItem) => {
      if (currentSafeBox !== undefined) {
        if (item.name === 'description') {
          item['description'] = currentSafeBox.descricao;
        } else if (item.name === 'formName') {
          item['formName'] = currentSafeBox.nome;
        } else {
          const safeBoxContent = JSON.parse(currentSafeBox.conteudo as string);
          item[`${item.name}`] = safeBoxContent[`${item.name}`];
          if (item[`crypto`] !== undefined) {
            if (
              item[`${item.name}`]?.startsWith('-----BEGIN PGP MESSAGE-----')
            ) {
              item[`crypto`] = true;
              item[`${item.name}`] = '******************';
            } else {
              item[`crypto`] = false;
            }
          }
          if (item[`${item.name}`] === undefined) {
            item[`${item.name}`] = '';
          }
        }
      }
      return item;
    });
  }

  const initialValues = getInitialValues();

  function handleSubmit(values: any) {
    if (currentOrganization && currentSafeBox) {
      toast.loading('Salvando...', { ...toastOptions, toastId: 'saveSafeBox' });

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
        event: IPCTypes.UPDATE_SAFE_BOX,
        data: {
          id: currentSafeBox._id,
          usuarios_leitura: currentSafeBox.usuarios_leitura,
          usuarios_escrita: currentSafeBox.usuarios_escrita,
          usuarios_leitura_deletado: currentSafeBox.usuarios_leitura_deletado,
          usuarios_escrita_deletado: currentSafeBox.usuarios_escrita_deletado,
          tipo: formik[formikIndex].type,
          criptografia: 'rsa',
          nome: values[0][`${values[0].name}`],
          descricao: values[size - 1][`${values[size - 1].name}`],
          conteudo: content,
          organizacao: currentOrganization._id,
          data_atualizacao: currentSafeBox.data_atualizacao,
          data_hora_create: currentSafeBox.data_hora_create,
        },
      });
    }
  }

  const formikProps = useFormik({
    initialValues,
    onSubmit: (values) => handleSubmit(values),
    enableReinitialize: true,
  });

  const handleCrypt = useCallback(() => {
    const myValues: IFormikItem[] = formik[formikIndex].item;
    myValues.forEach((item, index) => {
      if (item[`${item.name}`].startsWith('***')) {
        formikProps.setFieldValue(
          `${index}.${item.name}`,
          '******************'
        );
      }
    });

    changeSafeBoxMode('view');
  }, [formikIndex, formikProps]);

  useEffect(() => {
    if (currentSafeBox) {
      const index = formik.findIndex((item) => {
        return item.type === currentSafeBox.tipo;
      });

      formikProps.resetForm();
      changeFormikIndex(index);
      changeSafeBoxMode('view');
    }
  }, [currentSafeBox]);

  const onOpenChangeSharingModal = useCallback((open: boolean) => {
    setIsOpenSharingModal(open);
  }, []);

  const onOpenChangerifySafetyPhraseModal = useCallback((open: boolean) => {
    setIsOpenVerifySafetyPhrase(open);
  }, []);

  const onOpenChangeVerifyNameModal = useCallback((open: boolean) => {
    setIsOpenVerifyNameModal(open);
  }, []);

  const decrypt = useCallback(() => {
    formikProps.values.forEach((_: any, index: number) => {
      const message = JSON.parse(currentSafeBox?.conteudo as string)[
        `${formikProps.values[index].name}`
      ];
      if (message !== undefined) {
        if (message.startsWith('-----BEGIN PGP MESSAGE-----')) {
          decryptMessageIPC({
            message,
            name: formikProps.values[index].name as string,
            position: `${index}.${formikProps.values[index].name}`,
          });
        }
      }
    });
  }, [formikProps.values, currentSafeBox]);

  const handleDeleteSafeBox = useCallback(
    (isVerified: boolean) => {
      if (isVerified && currentOrganization && currentSafeBox) {
        updateLoading(true);
        changeSafeBoxesIsLoading(true);
        deleteSafeBoxIPC({
          organizationId: currentOrganization?._id,
          safeBoxId: currentSafeBox?._id,
        });
      }
    },
    [currentOrganization, currentSafeBox]
  );

  const handleDecrypt = useCallback((type: string) => {
    setVerifySafetyPhraseType(type);
    setIsOpenVerifySafetyPhrase(true);
  }, []);

  const addSafeBoxGroup = useCallback(
    (group: ISafeBoxGroup) => {
      if (currentSafeBox) {
        toast.loading('Salvando...', {
          ...toastOptions,
          toastId: 'updateSafeBoxGroup',
        });
        updateSafeBoxGroupIPC({
          id: group._id,
          description: group.descricao,
          name: group.nome,
          organization: group.organizacao,
          safeboxes: [
            ...(JSON.parse(group.cofres) as string[]),
            currentSafeBox?._id,
          ],
        });
      }
    },
    [currentSafeBox]
  );

  const removeSafeBoxFromGroup = useCallback(
    (group: ISafeBoxGroup) => {
      if (currentSafeBox) {
        toast.loading('Salvando...', {
          ...toastOptions,
          toastId: 'updateSafeBoxGroup',
        });
        const safeBoxes = JSON.parse(group.cofres) as string[];
        const filterSafeBoxes = safeBoxes.filter(
          (safebox) => safebox !== currentSafeBox?._id
        );

        updateSafeBoxGroupIPC({
          id: group._id,
          description: group.descricao,
          name: group.nome,
          organization: group.organizacao,
          safeboxes: filterSafeBoxes,
        });
      }
    },
    [currentSafeBox, safeBoxGroup]
  );

  const verify = useCallback(
    (isVerified: boolean) => {
      if (isVerified) {
        if (verifySafetyPhraseType === 'decryptSafeBox') {
          changeSafeBoxMode('decrypted');
          decrypt();
        } else {
          changeSafeBoxMode('edit');
          decrypt();
        }
        setIsOpenVerifySafetyPhrase(false);
      }
    },
    [verifySafetyPhraseType, decrypt]
  );

  const handleDiscart = useCallback(() => {
    changeSafeBoxMode('view');
  }, []);

  return {
    formikProps,
    currentSafeBox,
    onOpenChangeSharingModal,
    onOpenChangerifySafetyPhraseModal,
    isOpenSharingModal,
    onOpenChangeVerifyNameModal,
    isOpenVerifyNameModal,
    theme,
    isOpenVerifySafetyPhrase,
    safeBoxMode,
    changeSafeBoxMode,
    loading,
    handleDeleteSafeBox,
    handleDecrypt,
    verifySafetyPhraseType,
    handleCrypt,
    removeSafeBoxFromGroup,
    addSafeBoxGroup,
    safeBoxGroup,
    participantGroups,
    decrypt,
    verify,
    handleDiscart,
  };
}
