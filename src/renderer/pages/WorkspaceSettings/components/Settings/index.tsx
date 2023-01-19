import { useState } from 'react';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { useLoading } from 'renderer/hooks/useLoading';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';

export function Settings() {
  const { currentOrganization, deleteOrganization } = useOrganization();
  const { updateLoading, loading } = useLoading();
  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);
  async function handleOpenVerifyNameModal() {
    setIsOpenVerifyNameModal(true);
  }

  const closeOpenVerifyNameModal = () => {
    setIsOpenVerifyNameModal(false);
  };

  function verify(verified: boolean) {
    if (verified && currentOrganization) {
      updateLoading(true);
      deleteOrganization(currentOrganization?._id);
    }
  }
  return (
    <>
      <VerifyNameModal
        inputText="Nome da organizacao"
        isOpen={isOpenVerifyNameModal}
        onRequestClose={closeOpenVerifyNameModal}
        nameToVerify={currentOrganization?.nome}
        callback={verify}
        title="Tem certeza que deseja excluir"
        isLoading={loading}
      />
      <div>
        <button type="button" onClick={handleOpenVerifyNameModal}>
          Deletar
        </button>
      </div>
    </>
  );
}
