/* eslint-disable react/jsx-props-no-spreading */
import { useDropzone } from 'react-dropzone';
import { FaCamera } from 'react-icons/fa';
import { BsFillTrashFill } from 'react-icons/bs';
import { IoExit } from 'react-icons/io5';

import { Button } from 'renderer/components/Buttons/Button';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { useLoading } from 'renderer/hooks/useLoading';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { VerifyModal } from 'renderer/components/Modals/VerifyModal';
import { Input } from 'renderer/components/Inputs/Input';
import { TextArea } from 'renderer/components/TextAreas/TextArea';
import { useWorkspaceSettings } from 'renderer/hooks/useWorkspaceSettings/useWorkspaceSettings';

import { IUser } from 'main/types';
import logoNativeSec from '../../../../assets/logoNativesec/512.png';

import styles from './styles.module.sass';

export function WorkspaceSettings() {
  const {
    formikProps,
    isOpenVerifyModal,
    isOpenVerifyNameModal,
    closeOpenVerifyNameModal,
    verifyDeleteOrganization,
    openVerifyModal,
    openVerifyNameModal,
    verifyRemoveImage,
    closeVerifyModal,
    onDrop,
    discard,
    verifyOrganizationLeave,
    closeOpenVerifyModalLeave,
    isOpenVerifyModalLeave,
    openVerifyModalLeave,
  } = useWorkspaceSettings();

  const { currentOrganization, currentOrganizationIcon, isParticipant } =
    useOrganization();
  const { myEmail } = window.electron.store.get('user') as IUser;
  const { loading } = useLoading();
  const { theme } = useUserConfig();

  const { getRootProps } = useDropzone({
    onDrop,
  });

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

      <VerifyModal
        title="Tem certeza que deseja sair dessa organização?"
        isOpen={isOpenVerifyModalLeave}
        onRequestClose={closeOpenVerifyModalLeave}
        theme={theme}
        callback={verifyOrganizationLeave}
        isLoading={loading}
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
                <Button
                  Icon={<FaCamera />}
                  theme={theme}
                  text="Selecionar"
                  disabled={isParticipant}
                  color="blue"
                />
              </div>
              <Button
                Icon={<BsFillTrashFill />}
                text="Remover"
                className={styles.red}
                onClick={openVerifyModal}
                theme={theme}
                disabled={isParticipant}
                color="red"
              />
            </div>
          </div>

          <div className={styles.form}>
            <form onSubmit={formikProps.handleSubmit}>
              <Input
                name="name"
                text="Nome"
                value={formikProps.values.name}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                theme={theme}
                disabled={isParticipant}
              />
              <TextArea
                name="description"
                text="Descrição"
                value={formikProps.values.description}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                theme={theme}
                disabled={isParticipant}
              />

              <div className={styles.actions}>
                <Button
                  type="submit"
                  text="Salvar"
                  disabled={
                    (currentOrganization?.nome === formikProps.values.name &&
                      currentOrganization?.descricao ===
                        formikProps.values.description) ||
                    isParticipant
                  }
                  theme={theme}
                />
                <Button
                  type="button"
                  text="Descartar"
                  className={styles.red}
                  onClick={discard}
                  theme={theme}
                  disabled={isParticipant}
                  color="red"
                />
              </div>
            </form>
          </div>

          <div className={styles.separator}>
            <span>Ações</span>
          </div>

          <div className={styles.organizationActions}>
            <div className={styles.item}>
              <div className={styles.text}>
                <h3>Deletar Organização</h3>
                <span>
                  Essa ação irá excluir todos cofres, usuarios e configurações
                  desse workspace tal ação não poderá ser revertida{' '}
                </span>
              </div>
              <Button
                text="Deletar Workspace"
                Icon={<BsFillTrashFill />}
                onClick={openVerifyNameModal}
                theme={theme}
                disabled={isParticipant}
                color="red"
              />
            </div>
            <div className={styles.item}>
              <div className={styles.text}>
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
                theme={theme}
                onClick={openVerifyModalLeave}
                color="red"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
