import { Button } from '@/renderer/components/Buttons/Button';
import { Input } from '@/renderer/components/Inputs/Input';
import { TextArea } from '@/renderer/components/TextAreas/TextArea';
import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { useCreateSafeBoxGroup } from '@/renderer/hooks/useCreateSafeBoxGroup/useCreateSafeBoxGroup';
import * as Dialog from '@radix-ui/react-dialog';
import styles from './styles.module.sass';

interface CreateSafeBoxGroupModalProps {
  open: boolean;
  closeCreateSafeBoxGroupModal: () => void;
  edit?: {
    safeBoxGroup: ISafeBoxGroup;
  };
  title: string;
  theme: ThemeType;
}
export function CreateSafeBoxGroupModal({
  open,
  closeCreateSafeBoxGroupModal,
  edit,
  title,
  theme,
}: CreateSafeBoxGroupModalProps) {
  const { formikProps } = useCreateSafeBoxGroup({
    open,
    closeCreateSafeBoxGroupModal,
    edit,
  });

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={`${styles.overlay} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      />
      <Dialog.Content
        className={`${styles.content} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <Dialog.Title className={styles.title}>{title}</Dialog.Title>
        <form onSubmit={formikProps.handleSubmit}>
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
