import { Button } from '@/renderer/components/Buttons/Button';
import { SafeBoxInfo } from '@/renderer/components/SafeBox';
import { useSafeBoxGroup } from '@/renderer/hooks/useSafeBoxGroup/useSafeBoxGroup';
import { BsFillTrashFill } from 'react-icons/bs';
import { Header } from './components/Header';
import styles from './styles.module.sass';

export function SafeBoxGroup() {
  const { safeBoxGroup, currentSafeBoxGroup, groupSafeBoxes } =
    useSafeBoxGroup();

  return (
    <div className={styles.safeBoxGroupContainer}>
      {currentSafeBoxGroup && <Header safeBoxGroup={currentSafeBoxGroup} />}
      <main>
        {groupSafeBoxes.map((safebox) => {
          return (
            <div className={styles.safeBox}>
              <SafeBoxInfo safeBox={safebox} />
              <Button
                className={styles.button}
                Icon={<BsFillTrashFill />}
                color="red"
              />
            </div>
          );
        })}
      </main>
    </div>
  );
}
