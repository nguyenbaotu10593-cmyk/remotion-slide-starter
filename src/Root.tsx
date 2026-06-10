import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { SlideTemplate, SLIDE_DATA } from "./SlideTemplate";

// Tự tính duration: typing start + tổng ký tự / tốc độ + buffer cuối
const TYPING_START   = 42;
const CHARS_PER_FRAME = 1.4;
const END_BUFFER     = 40; // frames giữ nguyên sau khi gõ xong
const totalChars = SLIDE_DATA.segments.reduce((s, seg) => s + seg.text.length, 0);
const slideDuration = Math.ceil(TYPING_START + totalChars / CHARS_PER_FRAME + END_BUFFER);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={120}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="SlideTemplate"
        component={SlideTemplate}
        durationInFrames={slideDuration}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
