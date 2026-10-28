import "./dashboard.css";
import { icons } from "../central-icon";
import { Dashboard } from "./dashboard";

export const metadata = { title: "Dashboard · learninglobby" };

const I = icons({
  home: "IconHome", book: "IconBook", chart: "IconChart1", note: "IconNotes", gear: "IconSettingsGear1", panel: "IconSidebar",
  grid: "IconGrid", play: "IconPlayCircle", calendar: "IconCalendar1", layers: "IconLayersThree", flask: "IconLab", bookmark: "IconBookmark",
  check: "IconCheckCircle2", flame: "IconFire1", trophy: "IconTrophy", highlight: "IconHighlight", user: "IconCirclePerson", bell: "IconBell",
  lock: "IconLock", target: "IconTarget", clock: "IconClock", sun: "IconSun", billing: "IconReceiptBill",
});
export type IconKey = keyof typeof I;

export default function Page() {
  return <Dashboard icons={I} />;
}
