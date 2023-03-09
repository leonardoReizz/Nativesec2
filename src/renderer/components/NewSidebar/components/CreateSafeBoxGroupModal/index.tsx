import { Button } from '@/renderer/components/Buttons/Button';
import { Input } from '@/renderer/components/Inputs/Input';
import { TextArea } from '@/renderer/components/TextAreas/TextArea';
import { useCreateSafeBoxGroup } from '@/renderer/hooks/useCreateSafeBoxGroup/useCreateSafeBoxGroup';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect } from 'react';
import styles from './styles.module.sass';

interface CreateSafeBoxGroupModalProps {
  open: boolean;
  closeCreateSafeBoxGroupModal: () => void;
}
export function CreateSafeBoxGroupModal({
  open,
  closeCreateSafeBoxGroupModal,
}: CreateSafeBoxGroupModalProps) {
  const { formikProps } = useCreateSafeBoxGroup(
    open,
    closeCreateSafeBoxGroupModal
  );

  return (
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={styles.content}>
        <Dialog.Title className={styles.title}>
          Novo grupo de cofres
        </Dialog.Title>
        <form onSubmit={formikProps.handleSubmit}>
          <Input
            name="name"
            text="Nome"
            value={formikProps.values.name}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
          />
          <TextArea
            name="description"
            text="Descrição"
            value={formikProps.values.description}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
          />

          <div className={styles.actions}>
            <Dialog.Close className={styles.close}>
              <Button type="button" text="Cancelar" color="red" />
            </Dialog.Close>
            <Button
              type="submit"
              text="Salvar"
              color="green"
              disabled={
                Boolean(formikProps.errors.name) &&
                Boolean(formikProps.errors.description)
              }
            />
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
