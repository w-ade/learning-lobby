import "../dashboard/dashboard.css";
import "./canvas.css";
import { icons } from "../central-icon";
import { Canvas } from "./canvas";

export const metadata = { title: "Canvas · learninglobby" };

const I = icons({
  layers: "IconLayersThree", book: "IconBook", stack: "IconLayersTwo", play: "IconPlayCircle", flask: "IconLab", check: "IconCheckCircle2",
  circle: "IconCircle", sparkle: "IconSparkle", calendar: "IconCalendar1", thumbsDown: "IconThumbsDown", note: "IconNotes", hammer: "IconHammer", highlight: "IconHighlight", search: "IconMagnifyingGlass", toc: "IconListBullets", focus: "IconFocusMode",
  arrowLeft: "IconArrowLeft", globe: "IconGlobe", copy: "IconSquareBehindSquare1",
  link: "IconChainLink1", archive: "IconArchive", close: "IconCrossSmall", board: "IconWhiteboard", code: "IconCode", branch: "IconBranch", clock: "IconClock", chevronRight: "IconChevronRightSmall",
  plus: "IconPlusSmall", minus: "IconMinusSmall", fit: "IconExpandSimple", reset: "IconArrowRotateCounterClockwise", grip: "IconDotGrid2x3",
});
export type CanvasIconKey = keyof typeof I;

export default function Page() {
  return <Canvas icons={I} />;
}
