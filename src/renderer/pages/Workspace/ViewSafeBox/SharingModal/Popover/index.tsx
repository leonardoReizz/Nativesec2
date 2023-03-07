/* eslint-disable jsx-a11y/label-has-associated-control */
import { IUserSelected } from '@/renderer/hooks/useSharingModal';
import * as Popover from '@radix-ui/react-popover';
import * as RadioGroup from '@radix-ui/react-radio-group';

import { IoIosClose } from 'react-icons/io';
import styles from './styles.module.sass';

interface PopoverComponentProps {
  callback: (data: IUserSelected) => void;
  email: string;
}

export function PopoverComponent({ callback, email }: PopoverComponentProps) {
  return (
    <Popover.Portal>
      <Popover.Content className={styles.PopoverContent} sideOffset={5}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p className={styles.Text} style={{ marginBottom: 10 }}>
            Nivel de Permissão
          </p>
          <fieldset className={styles.Fieldset}>
            <form>
              <RadioGroup.Root
                className={styles.RadioGroupRoot}
                aria-label="View density"
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <RadioGroup.Item
                    className={styles.RadioGroupItem}
                    value="participant"
                    id="r1"
                    onClick={() => callback({ email, type: 'participant' })}
                  >
                    <RadioGroup.Indicator
                      className={styles.RadioGroupIndicator}
                    />
                  </RadioGroup.Item>
                  <label className={styles.Label} htmlFor="r1">
                    Apenas Leitura
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <RadioGroup.Item
                    className={styles.RadioGroupItem}
                    value="admin"
                    id="r2"
                    onClick={() => callback({ email, type: 'admin' })}
                  >
                    <RadioGroup.Indicator
                      className={styles.RadioGroupIndicator}
                    />
                  </RadioGroup.Item>
                  <label className={styles.Label} htmlFor="r2">
                    Leitura e Escrita
                  </label>
                </div>
              </RadioGroup.Root>
            </form>
          </fieldset>
        </div>
        <Popover.Close className={styles.PopoverClose} aria-label="Close">
          <IoIosClose />
        </Popover.Close>
        <Popover.Arrow className={styles.PopoverArrow} />
      </Popover.Content>
    </Popover.Portal>
  );
}
