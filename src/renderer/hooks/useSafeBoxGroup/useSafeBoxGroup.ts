import { SafeBoxesContext } from '@/renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ISafeBox } from '@/renderer/contexts/SafeBoxesContext/types';
import { SafeBoxGroupContext } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export function useSafeBoxGroup() {
  const { safeBoxes } = useContext(SafeBoxesContext);
  const [groupSafeBoxes, setGroupSafeBoxes] = useState<ISafeBox[]>([]);
  const safeBoxGroupContext = useContext(SafeBoxGroupContext);
  const params = useParams();

  useEffect(() => {
    if (safeBoxGroupContext.currentSafeBoxGroup) {
      const getGroupSafeBoxes = JSON.parse(
        safeBoxGroupContext.currentSafeBoxGroup?.cofres
      )
        .map((safeboxId: string) => {
          const filter = safeBoxes.filter(
            (safebox) => safebox._id === safeboxId
          );

          return filter[0] || undefined;
        })
        .filter((safebox: ISafeBox | undefined) => safebox !== undefined);

      setGroupSafeBoxes(getGroupSafeBoxes);
    }
  }, [safeBoxes, safeBoxGroupContext.currentSafeBoxGroup]);

  useEffect(() => {
    const { safeBoxGroupId } = params;

    if (safeBoxGroupId) {
      const filter = safeBoxGroupContext.safeBoxGroup.filter(
        (group) => group._id === safeBoxGroupId
      );

      if (filter[0]) {
        safeBoxGroupContext.updateCurrentSafeBoxGroup(filter[0]);
      }
    }
  }, [params]);

  console.log(safeBoxGroupContext.currentSafeBoxGroup, 'aa');
  return { ...safeBoxGroupContext, groupSafeBoxes };
}
