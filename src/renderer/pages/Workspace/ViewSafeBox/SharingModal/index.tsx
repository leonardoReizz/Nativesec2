import * as Dialog from '@radix-ui/react-dialog';

import styles from './styles.module.sass';

export function SharingModal() {
  return (
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content>USERS</Dialog.Content>
    </Dialog.Portal>
  );
}
