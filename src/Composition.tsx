import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";

const { fontFamily: oswald } = loadOswald("normal", {
  weights: ["700"],
  subsets: ["latin", "vietnamese"],
});
const { fontFamily: manrope } = loadManrope("normal", {
  weights: ["400", "600"],
  subsets: ["latin", "vietnamese"],
});

// ── Brand / chart colors ──────────────────────────────────────────────────────
const CREAM = "#F3F1EB";
const INK   = "#1A1A1C";

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// ── Bar data ──────────────────────────────────────────────────────────────────
const MAX_VALUE = 100;
const BARS = [
  { id: "dang-ky",    label: "HỌC VIÊN\nĐĂNG KÝ",      value: 100, color: "#F25622", stat: "100 học viên" },
  { id: "hoan-thanh", label: "HOÀN THÀNH\nKHOÁ HỌC",    value: 100, color: "#F5C518", stat: "Tỉ lệ 100%" },
  { id: "ap-dung",    label: "ÁP DỤNG\nPHƯƠNG PHÁP",   value: 100, color: "#E91E8C", stat: "Tỉ lệ 100%" },
  { id: "cai-thien",  label: "CẢI THIỆN\nĐIỂM SỐ",     value: 80,  color: "#F79234", stat: "80 học viên" },
];

// ── Layout constants ──────────────────────────────────────────────────────────
const W = 1280;
const H = 720;

const CHART_LEFT   = 68;   // Y-axis left edge
const CHART_RIGHT  = 790;  // chart ends here
const BASELINE_Y   = 628;  // bottom of bars
const MAX_BAR_H    = 490;  // height when value = 100

const BAR_W   = 130;
const BAR_GAP = 28;
// Total 4 bars: 4*130 + 3*28 = 604 — centered in chart area
const CHART_W  = CHART_RIGHT - CHART_LEFT;
const BARS_W   = BARS.length * BAR_W + (BARS.length - 1) * BAR_GAP;
const BAR_START_X = CHART_LEFT + (CHART_W - BARS_W) / 2;

// ── Y-axis ticks ──────────────────────────────────────────────────────────────
const YAxis: React.FC = () => {
  const frame = useCurrentFrame();
  const TICKS = 11;
  return (
    <>
      {Array.from({ length: TICKS }).map((_, i) => {
        const frac  = i / (TICKS - 1);
        const y     = BASELINE_Y - frac * MAX_BAR_H;
        const delay = i * 3;
        const op    = interpolate(frame - delay, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: CHART_LEFT - 22,
              top: y - 1,
              width: 16,
              height: 2,
              background: INK,
              opacity: op,
            }}
          />
        );
      })}
      {/* Baseline */}
      <div
        style={{
          position: "absolute",
          left: CHART_LEFT - 22,
          top: BASELINE_Y,
          width: CHART_RIGHT - CHART_LEFT + 22,
          height: 2,
          background: INK,
          opacity: interpolate(frame, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </>
  );
};

// ── Single bar ────────────────────────────────────────────────────────────────
const Bar: React.FC<{
  index: number;
  label: string;
  value: number;
  color: string;
  stat: string;
  x: number;
}> = ({ index, label, value, color, stat, x }) => {
  const frame = useCurrentFrame();
  const GROW_START = 12 + index * 12;
  const GROW_DUR   = 28;

  const progress = interpolate(frame - GROW_START, [0, GROW_DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const barH      = (value / MAX_VALUE) * MAX_BAR_H * progress;
  const labelOp   = interpolate(frame - GROW_START - 10, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lines = label.split("\n");

  return (
    <>
      {/* Bar itself */}
      <div
        style={{
          position: "absolute",
          left: x,
          bottom: H - BASELINE_Y,
          width: BAR_W,
          height: barH,
          background: color,
        }}
      />

      {/* Label above bar */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: BASELINE_Y - barH - 6 - 52,
          width: BAR_W,
          opacity: labelOp,
          transform: `translateY(${(1 - labelOp) * 8}px)`,
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: oswald,
              fontWeight: 700,
              fontSize: 17,
              lineHeight: 1.25,
              color: INK,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Stat below baseline */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: BASELINE_Y + 14,
          width: BAR_W,
          opacity: labelOp,
        }}
      >
        {/* Color swatch */}
        <div
          style={{
            width: 14,
            height: 14,
            background: color,
            marginBottom: 5,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            fontFamily: manrope,
            fontWeight: 600,
            fontSize: 13,
            color: INK,
            letterSpacing: "0.01em",
          }}
        >
          {stat}
        </div>
        <div
          style={{
            fontFamily: manrope,
            fontWeight: 400,
            fontSize: 12,
            color: "#7A7A7E",
            marginTop: 2,
          }}
        >
          {value}%
        </div>
      </div>
    </>
  );
};

// ── Right info panel ──────────────────────────────────────────────────────────
const RightPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const PANEL_X = 840;

  const titleOp = interpolate(frame, [40, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const titleY = interpolate(frame, [40, 58], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const numOp = interpolate(frame, [52, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const numScale = interpolate(frame, [52, 72], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <>
      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: PANEL_X,
          top: 92,
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: oswald,
            fontWeight: 700,
            fontSize: 58,
            lineHeight: 1.0,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            color: INK,
          }}
        >
          KẾT QUẢ
          <br />
          KHOÁ HỌC
        </div>
      </div>

      {/* Big 80% + arrow */}
      <div
        style={{
          position: "absolute",
          left: PANEL_X,
          top: 268,
          opacity: numOp,
          transform: `scale(${numScale})`,
          transformOrigin: "left top",
          display: "flex",
          alignItems: "flex-start",
          gap: 4,
        }}
      >
        {/* 80 */}
        <div
          style={{
            fontFamily: oswald,
            fontWeight: 700,
            fontSize: 230,
            lineHeight: 0.85,
            color: INK,
            letterSpacing: "-0.02em",
          }}
        >
          80
        </div>
        {/* % and arrow stacked */}
        <div style={{ display: "flex", flexDirection: "column", paddingTop: 18 }}>
          <div
            style={{
              fontFamily: oswald,
              fontWeight: 700,
              fontSize: 110,
              lineHeight: 1.0,
              color: INK,
            }}
          >
            %
          </div>
          <div
            style={{
              fontFamily: oswald,
              fontWeight: 700,
              fontSize: 110,
              lineHeight: 1.0,
              color: INK,
            }}
          >
            ↑
          </div>
        </div>
      </div>

      {/* Sub-label */}
      <div
        style={{
          position: "absolute",
          left: PANEL_X,
          bottom: 52,
          opacity: interpolate(frame, [68, 82], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily: manrope,
            fontWeight: 600,
            fontSize: 15,
            color: "#4A4A4E",
            letterSpacing: "0.01em",
          }}
        >
          Cải thiện điểm số sau khoá học
        </div>
      </div>
    </>
  );
};

// ── Main composition ──────────────────────────────────────────────────────────
export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: CREAM }}>
      <YAxis />
      {BARS.map((bar, i) => (
        <Bar
          key={bar.id}
          index={i}
          label={bar.label}
          value={bar.value}
          color={bar.color}
          stat={bar.stat}
          x={BAR_START_X + i * (BAR_W + BAR_GAP)}
        />
      ))}
      <RightPanel />
    </AbsoluteFill>
  );
};
