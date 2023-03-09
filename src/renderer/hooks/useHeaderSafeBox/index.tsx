import { CreateSafeBoxContext } from '@/renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { IFormikItem } from '@/renderer/contexts/CreateSafeBox/types';
import { LoadingContext } from '@/renderer/contexts/LoadingContext/LoadingContext';
import { OrganizationsContext } from '@/renderer/contexts/OrganizationsContext/OrganizationsContext';
import { SafeBoxesContext } from '@/renderer/contexts/SafeBoxesContext/safeBoxesContext';
import {
  ISafeBoxGroup,
  SafeBoxGroupContext,
} from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { UserConfigContext } from '@/renderer/contexts/UserConfigContext/UserConfigContext';
import { deleteSafeBoxIPC } from '@/renderer/services/ipc/SafeBox';
import { updateSafeBoxGroupIPC } from '@/renderer/services/ipc/SafeBoxGroup';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import { FormikContextType } from 'formik';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import formik from '../../utils/Formik/formik';
import { useSafeBox } from '../useSafeBox/useSafeBox';

export function useHeaderSafeBox() {
  const { theme } = useContext(UserConfigContext);
  const { safeBoxGroup } = useContext(SafeBoxGroupContext);
  const { currentSafeBox, changeSafeBoxesIsLoading } =
    useContext(SafeBoxesContext);
  const { formikIndex, changeFormikIndex } = useContext(CreateSafeBoxContext);
  const [verifySafetyPhraseType, setVerifySafetyPhraseType] = useState('');
  const [isOpenSharingModal, setIsOpenSharingModal] = useState<boolean>(false);
  const { currentOrganization } = useContext(OrganizationsContext);
  const [verifySafetyPhraseIsOpen, setVerifySafetyPhraseIsOpen] =
    useState<boolean>(false);
  const [verifyNameModalIsOpen, setVerifyNameModalIsOpen] =
    useState<boolean>(false);

  const {
    submitSafeBox,
    formikProps,
    decrypt,
    usersAdmin,
    usersParticipant,
    changeSafeBoxMode,
    safeBoxMode,
  } = useSafeBox();

  const { mode } = useParams();
  const location = useLocation();

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

  const { loading, updateLoading } = useContext(LoadingContext);

  const handleCloseVerifySafetyPhraseModal = useCallback(() => {
    setVerifySafetyPhraseIsOpen(false);
  }, []);

  function handleOpenVerifySafetyPhraseModal() {
    setVerifySafetyPhraseIsOpen(true);
  }

  function handleOpenVerifyNameModal() {
    setVerifyNameModalIsOpen(true);
  }

  const handleCloseVerifyNameModal = useCallback(() => {
    setVerifyNameModalIsOpen(false);
  }, []);

  function verify(isVerified: boolean) {
    if (isVerified) {
      if (verifySafetyPhraseType === 'decryptSafeBox') {
        changeSafeBoxMode('decrypted');
        decrypt();
      } else {
        changeSafeBoxMode('edit');
        decrypt();
      }
      handleCloseVerifySafetyPhraseModal();
    }
  }

  function handleDiscart() {
    changeSafeBoxMode('view');
  }

  useEffect(() => {
    if (mode === 'edit') {
      setVerifySafetyPhraseIsOpen(true);
    } else if (mode === 'decrypt') {
      setVerifySafetyPhraseType('decryptSafeBox');
      handleOpenVerifySafetyPhraseModal();
    } else if (mode === 'delete') {
      setVerifyNameModalIsOpen(true);
    }

    console.log(mode, ' mode');
  }, [location]);

  function handleSave() {
    if (currentOrganization) {
      submitSafeBox({
        formikProps: formikProps as unknown as FormikContextType<IFormikItem[]>,
        formikIndex,
        currentOrganizationId: currentOrganization._id,
        usersAdmin,
        usersParticipant,
      });
    }
  }

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

  const handleSelectOptionToCreateSafeBox = useCallback((index: number) => {
    changeFormikIndex(index);
  }, []);

  const handleDecrypt = useCallback((type: string) => {
    setVerifySafetyPhraseType(type);
    handleOpenVerifySafetyPhraseModal();
  }, []);

  function handleCrypt() {
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
  }

  const openSharingModal = useCallback((open: boolean) => {
    setIsOpenSharingModal(open);
  }, []);

  const closeSharingModal = useCallback(() => {
    setIsOpenSharingModal(false);
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

  const onOpenChangeSharingModal = useCallback((open: boolean) => {
    setIsOpenSharingModal(open);
  }, []);

  return {
    currentSafeBox,
    isOpenSharingModal,
    openSharingModal,
    closeSharingModal,
    verifySafetyPhraseIsOpen,
    handleCloseVerifySafetyPhraseModal,
    verify,
    theme,
    verifyNameModalIsOpen,
    handleCloseVerifyNameModal,
    handleDeleteSafeBox,
    loading,
    safeBoxMode,
    formikIndex,
    handleSelectOptionToCreateSafeBox,
    handleDecrypt,
    handleCrypt,
    removeSafeBoxFromGroup,
    participantGroups,
    addSafeBoxGroup,
    safeBoxGroup,
    handleOpenVerifyNameModal,
    handleSave,
    handleDiscart,
    onOpenChangeSharingModal,
  };
}
