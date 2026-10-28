import "./dashboard.css";
import { icons } from "../central-icon";
import { Dashboard } from "./dashboard";

export const metadata = { title: "Dashboard · learninglobby" };

const I = icons({
  home: "IconHome", book: "IconBook", note: "IconNotes", panel: "IconSidebar",
  grid: "IconGrid", play: "IconPlayCircle", calendar: "IconCalendar1", layers: "IconLayersThree", flask: "IconLab", bookmark: "IconBookmark",
  check: "IconCheckCircle2", flame: "IconFire1", hammer: "IconHammer", sparkle: "IconSparkle", thumbsDown: "IconThumbsDown", stack: "IconLayersTwo", highlight: "IconHighlight", user: "IconCirclePerson", bell: "IconBell",
  lock: "IconLock", gear: "IconSettingsGear1", moon: "IconMoon", keyboard: "IconKeyboard", help: "IconQuestionmarkCircle", door: "IconDoor",
  chevronLeft: "IconChevronLeft", chevronRight: "IconChevronRight", target: "IconTarget", clock: "IconClock", sun: "IconSun",
});
export type IconKey = keyof typeof I;

export default function Page() {
  return <Dashboard icons={I} />;
}
