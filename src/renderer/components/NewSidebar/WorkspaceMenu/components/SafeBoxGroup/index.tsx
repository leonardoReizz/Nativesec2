import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';

interface SafeBoxGroupProps {
  safeBoxGroup: ISafeBoxGroup;
  theme?: ThemeType;
}

export function SafeBoxGroup({
  safeBoxGroup,
  theme = 'light',
}: SafeBoxGroupProps) {
  return <div>{safeBoxGroup.nome}</div>;
}
