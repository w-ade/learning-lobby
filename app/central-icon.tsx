// Server-only: @central-icons-react/all inlines every variant (~57MB), so render icons here and pass the nodes to client components.
import { CentralIcon } from "@central-icons-react/all";
import type { CentralIconName } from "@central-icons-react/all/icons";

// Project style: line icons, 2px stroke, large corner radius.
export function Icon({ name, size = 16 }: { name: CentralIconName; size?: number }) {
  return <CentralIcon name={name} join="round" fill="outlined" radius="3" stroke="2" size={size} />;
}

export function icons<K extends string>(names: Record<K, CentralIconName>) {
  return Object.fromEntries(Object.entries(names).map(([k, n]) => [k, <Icon key={k} name={n as CentralIconName} />])) as Record<K, React.ReactNode>;
}
