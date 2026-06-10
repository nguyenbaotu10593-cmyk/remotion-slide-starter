/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  SLIDE TEMPLATE — Brand Motion 16:9                         ║
 * ║  Chỉnh sửa SLIDE_DATA bên dưới để thay nội dung             ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Cách dùng:
 *   segments: mảng các đoạn text.
 *   - { text: "..." }           → text thường
 *   - { text: "...", highlight: true } → text có highlight cam
 *
 * Ký tự "\n" trong text = xuống dòng.
 */

// ── ① CẤU HÌNH NỘI DUNG — chỉnh sửa ở đây ───────────────────────────────────
export const SLIDE_DATA = {
  number: 1,
  segments: [
    { text: "Điểm vượt trội của AI agent so với\nnhững mô hình " },
    { text: "AI chat bình thường", highlight: true },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: playfair } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin", "vietnamese"],
});

// ── Brand colors ──────────────────────────────────────────────────────────────
const BG        = "#F5F0E8";
const ORANGE    = "#C96A42";
const INK       = "#1C1C1C";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

// ── Helpers ───────────────────────────────────────────────────────────────────
type Segment = { text: string; highlight?: boolean };

/** Tổng số ký tự của tất cả segments */
const totalChars = (segs: Segment[]) =>
  segs.reduce((s, seg) => s + seg.text.length, 0);

/** Số ký tự đã gõ tại frame hiện tại */
const getTypedCount = (frame: number, startFrame: number, charsPerFrame: number) =>
  Math.min(
    totalChars(SLIDE_DATA.segments),
    Math.max(0, Math.floor((frame - startFrame) * charsPerFrame))
  );

// ── Starburst SVG ─────────────────────────────────────────────────────────────
const Starburst: React.FC<{ size?: number }> = ({ size = 180 }) => {
  const frame = useCurrentFrame();
  const PETALS = 12;

  const scale = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const rotate = interpolate(frame, [0, 60], [0, 15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        width: size,
        height: size * 1.25,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        transformOrigin: "center bottom",
      }}
    >
      <svg
        viewBox="-50 -75 100 130"
        width={size}
        height={size * 1.25}
        overflow="visible"
      >
        {/* Petals */}
        {Array.from({ length: PETALS }).map((_, i) => (
          <ellipse
            key={i}
            cx={0}
            cy={-30}
            rx={6.5}
            ry={26}
            fill={ORANGE}
            transform={`rotate(${(360 / PETALS) * i})`}
          />
        ))}
        {/* Stem */}
        <rect x={-3.5} y={2} width={7} height={46} rx={3} fill={ORANGE} />
      </svg>
    </div>
  );
};

// ── Divider line ──────────────────────────────────────────────────────────────
const Divider: React.FC = () => {
  const frame = useCurrentFrame();
  const scaleX = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <div
      style={{
        height: 3,
        background: ORANGE,
        transformOrigin: "left center",
        transform: `scaleX(${scaleX})`,
      }}
    />
  );
};

// ── Number badge ──────────────────────────────────────────────────────────────
const Badge: React.FC<{ n: number }> = ({ n }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [32, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: ORANGE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transform: `scale(${scale})`,
      }}
    >
      <span
        style={{
          fontFamily: playfair,
          fontWeight: 700,
          fontSize: 26,
          color: "#fff",
          lineHeight: 1,
        }}
      >
        {n}
      </span>
    </div>
  );
};

// ── Typewriter text ───────────────────────────────────────────────────────────
const TYPING_START  = 42;   // frame bắt đầu gõ
const CHARS_PER_FRAME = 1.4; // tốc độ gõ (ký tự/frame)
const HIGHLIGHT_DELAY = 6;   // frame delay sau khi gõ xong → sweep highlight

const TypewriterText: React.FC<{ segments: Segment[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const typed = getTypedCount(frame, TYPING_START, CHARS_PER_FRAME);

  let charsRendered = 0;

  return (
    <div
      style={{
        fontFamily: playfair,
        fontWeight: 700,
        fontSize: 54,
        lineHeight: 1.35,
        color: INK,
        letterSpacing: "-0.01em",
      }}
    >
      {segments.map((seg, si) => {
        const start = charsRendered;
        const visible = Math.max(0, Math.min(seg.text.length, typed - start));
        charsRendered += seg.text.length;

        const visibleText = seg.text.slice(0, visible);

        if (!seg.highlight) {
          // Render newlines correctly
          return (
            <span key={si}>
              {visibleText.split("\n").map((line, li, arr) => (
                <React.Fragment key={li}>
                  {line}
                  {li < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          );
        }

        // Highlight segment: show text + animated background sweep
        const fullyTypedFrame = TYPING_START + (start + seg.text.length) / CHARS_PER_FRAME;
        const sweepProgress = interpolate(
          frame - fullyTypedFrame - HIGHLIGHT_DELAY,
          [0, 14],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }
        );

        return (
          <span
            key={si}
            style={{
              position: "relative",
              display: "inline",
              // Trick: use box-decoration-break for multi-line highlight
              WebkitBoxDecorationBreak: "clone",
              boxDecorationBreak: "clone",
              background: `linear-gradient(to right, ${ORANGE} ${sweepProgress * 100}%, transparent ${sweepProgress * 100}%)`,
              color: sweepProgress > 0.01 ? "#fff" : INK,
              padding: "2px 8px",
              borderRadius: 4,
              transition: "color 0s",
            }}
          >
            {visibleText}
          </span>
        );
      })}
    </div>
  );
};

// ── Main composition ──────────────────────────────────────────────────────────
export const SlideTemplate: React.FC = () => {
  const { width } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Top half — starburst centered */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 0,
        }}
      >
        <div style={{ marginBottom: -4 }}>
          <Starburst size={160} />
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: "100%" }}>
        <Divider />
      </div>

      {/* Bottom half — number + text */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          paddingLeft: 80,
          paddingRight: 80,
          gap: 32,
        }}
      >
        <Badge n={SLIDE_DATA.number} />
        <TypewriterText segments={SLIDE_DATA.segments} />
      </div>
    </AbsoluteFill>
  );
};
