/** @jsxImportSource react */
import React from "react";
/**
 * generate-flyer.tsx
 * Renders the comedy event schedule to a PNG using Satori (JSX→SVG) + resvg (SVG→PNG).
 *
 * Usage:
 *   npx tsx scripts/generate-flyer.tsx
 *   npx tsx scripts/generate-flyer.tsx --month        (filter to current month only)
 *   npx tsx scripts/generate-flyer.tsx --output my-flyer.png
 */

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import data from "../data.json";

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const filterByMonth = args.includes("--month");
const outputIdx = args.indexOf("--output");
const outputFile = outputIdx !== -1 ? args[outputIdx + 1] : "flyer.png";

// ---------------------------------------------------------------------------
// Fonts  (WOFF, not WOFF2 — Satori requirement)
// ---------------------------------------------------------------------------
const FONTS_DIR = join(process.cwd(), "node_modules");

const fonts = [
  {
    name: "Merriweather Sans",
    data: readFileSync(join(FONTS_DIR, "@fontsource/merriweather-sans/files/merriweather-sans-latin-400-normal.woff")),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "Merriweather Sans",
    data: readFileSync(join(FONTS_DIR, "@fontsource/merriweather-sans/files/merriweather-sans-latin-700-normal.woff")),
    weight: 700 as const,
    style: "normal" as const,
  },
  {
    name: "Roboto Mono",
    data: readFileSync(join(FONTS_DIR, "@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff")),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "Comic Neue",
    data: readFileSync(join(FONTS_DIR, "@fontsource/comic-neue/files/comic-neue-latin-700-normal.woff")),
    weight: 700 as const,
    style: "normal" as const,
  },
  {
    name: "Fredoka One",
    data: readFileSync(join(FONTS_DIR, "@fontsource/fredoka-one/files/fredoka-one-latin-400-normal.woff")),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "Caveat",
    data: readFileSync(join(FONTS_DIR, "@fontsource/caveat/files/caveat-latin-700-normal.woff")),
    weight: 700 as const,
    style: "normal" as const,
  },
];

// ---------------------------------------------------------------------------
// Logo images → base64 data URIs
// ---------------------------------------------------------------------------
const ASSETS_DIR = join(process.cwd(), "src/assets");

function logoDataUri(filename: string, mime = "image/png"): string {
  try {
    const buf = readFileSync(join(ASSETS_DIR, filename));
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return "";
  }
}

const LOGOS: Record<string, { uri: string; cover?: boolean; invert?: boolean }> = {
  alchemy: { uri: logoDataUri("alchemy-logo.png") },
  arcana: { uri: logoDataUri("arcana-logo.jpg", "image/jpeg"), cover: true },
  muses: { uri: logoDataUri("black-sheep-logo.png") },
  "black sheep": { uri: logoDataUri("black-sheep-logo.png") },
  artscenter: { uri: logoDataUri("black-sheep-logo.png") },
  comedyworx: { uri: logoDataUri("comedyworx-logo.png") },
  "durty bull": { uri: logoDataUri("durty-bull-logo.png") },
  "durty-bull": { uri: logoDataUri("durty-bull-logo.png") },
  goodnights: { uri: logoDataUri("goodnights-logo.jpg", "image/jpeg") },
  kings: { uri: logoDataUri("kings.png") },
  mettlesome: { uri: logoDataUri("mettlesome-logo.png") },
  phi: { uri: logoDataUri("last-word-logo.png") },
  trackside: { uri: logoDataUri("trackside-logo.png"), invert: true },
};

const GRFC_LOGO = logoDataUri("robot.png");
const STANDUP_LOGO = logoDataUri("standup-logo.png");
const DEFAULT_LOGO = logoDataUri("default-logo.png");

interface Show {
  type: string; day: string; date: string; time?: string;
  venue: string; city: string; group?: string; character?: string; details?: string;
}

function getLogoInfo(show: Show): { uri: string; cover?: boolean; invert?: boolean } {
  if (show.type.toLowerCase().includes("giant robot fight club")) {
    return { uri: GRFC_LOGO, cover: true };
  }
  const vl = show.venue.toLowerCase().trim();
  for (const [key, val] of Object.entries(LOGOS)) {
    if (vl.includes(key)) return val;
  }
  const tl = show.type.toLowerCase();
  if (tl.includes("stand") || tl.includes("open mic")) return { uri: STANDUP_LOGO };
  return { uri: DEFAULT_LOGO };
}

// ---------------------------------------------------------------------------
// Gradient helper (matches ComedyFlyer.tsx logic)
// ---------------------------------------------------------------------------
function getGradient(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("improv"))
    return "linear-gradient(45deg, hsl(2, 72%, 45%) 30%, hsl(22, 86%, 55%))";
  if (t.includes("stand") || t.includes("open mic"))
    return "linear-gradient(135deg, hsl(22, 86%, 45%) 40%, hsl(43, 92%, 56%))";
  if (t.includes("music") || t.includes("concert"))
    return "linear-gradient(45deg, hsl(327, 30%, 45%) 50%, hsl(2, 72%, 55%))";
  return "linear-gradient(135deg, hsl(200, 36%, 43%) 20%, hsl(327, 30%, 60%))";
}

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------
const WIDTH = 500;
const OUTER_PAD = 32;
const PAD = 24;
const HEADER_H = 110;
const SHOW_H = 88;
const SHOW_H_DETAILS = 112;
const SHOW_GAP = 8;
const FOOTER_H = 36;

function showHeight(show: Show) {
  return show.details ? SHOW_H_DETAILS : SHOW_H;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const allShows: Show[] = data.shows;
const shows = filterByMonth
  ? allShows.filter((s) => s.date.toLowerCase().includes(data.month.toLowerCase()))
  : allShows;

const innerHeight =
  PAD + HEADER_H + shows.reduce((sum, s) => sum + showHeight(s), 0) + (shows.length - 1) * SHOW_GAP + FOOTER_H + PAD;
const height = innerHeight + OUTER_PAD * 2;
const totalWidth = WIDTH + OUTER_PAD * 2;

// ---------------------------------------------------------------------------
// Flyer JSX  (Satori: inline styles, flexbox only, no Tailwind)
// ---------------------------------------------------------------------------
const flyer = (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: totalWidth,
      height,
      backgroundImage: "linear-gradient(135deg, hsl(43, 92%, 56%), hsl(22, 86%, 55%))",
      padding: OUTER_PAD,
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: WIDTH,
        height: innerHeight,
        borderRadius: 16,
        padding: PAD,
        fontFamily: "Merriweather Sans",
        position: "relative",
      }}
    >
      {/* ── Header ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
        <span
          style={{
            fontFamily: "Merriweather Sans",
            fontWeight: 700,
            fontSize: 28,
            color: "#3c3836",
            letterSpacing: 1,
          }}
        >
          ASHLYN ON STAGE
        </span>
        <span
          style={{
            fontFamily: "Caveat",
            fontWeight: 700,
            fontSize: 22,
            color: "#3c3836",
            marginTop: 4,
          }}
        >
          {filterByMonth ? `${data.month} ${data.year}` : "Upcoming Shows"}
        </span>
        {/* Red divider */}
        <div style={{ width: 72, height: 4, backgroundColor: "#cc241d", borderRadius: 4, marginTop: 8 }} />
      </div>

      {/* ── Show cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: SHOW_GAP }}>
        {shows.map((show, i) => {
          const logo = getLogoInfo(show);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "10px 14px",
                borderRadius: 12,
                backgroundImage: getGradient(show.type),
                height: showHeight(show),
                boxSizing: "border-box",
              }}
            >
              {/* Left: text */}
              <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                {show.details && (
                  <span
                    style={{
                      fontFamily: "Caveat",
                      fontWeight: 700,
                      fontSize: 17,
                      color: "white",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 2,
                    }}
                  >
                    {show.details}
                  </span>
                )}

                {/* Type + group/character badges */}
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span
                    style={{
                      fontFamily: "Caveat",
                      fontWeight: 700,
                      fontSize: 14,
                      color: "white",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    {show.type}
                  </span>
                  {show.group && (
                    <span
                      style={{
                        fontFamily: "Roboto Mono",
                        fontWeight: 400,
                        fontSize: 10,
                        color: "white",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        paddingLeft: 8,
                        paddingRight: 8,
                        paddingTop: 3,
                        paddingBottom: 3,
                        borderRadius: 99,
                      }}
                    >
                      with {show.group}
                    </span>
                  )}
                  {show.character && (
                    <span
                      style={{
                        fontFamily: "Roboto Mono",
                        fontWeight: 400,
                        fontSize: 10,
                        color: "white",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        paddingLeft: 8,
                        paddingRight: 8,
                        paddingTop: 3,
                        paddingBottom: 3,
                        borderRadius: 99,
                      }}
                    >
                      as {show.character}
                    </span>
                  )}
                </div>

                {/* Day, date, time */}
                <span style={{ fontFamily: "Comic Neue", fontWeight: 700, fontSize: 16, color: "white" }}>
                  {show.day}, {show.date}{show.time ? ` at ${show.time}` : ""}
                </span>

                {/* Venue • City */}
                <span style={{ fontFamily: "Roboto Mono", fontWeight: 400, fontSize: 11, color: "rgba(255,255,255,0.9)", marginTop: 2 }}>
                  {show.venue}{show.city ? ` • ${show.city}` : ""}
                </span>
              </div>

              {/* Right: venue logo circle */}
              {logo.uri && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 56,
                    height: 44,
                    backgroundColor: "white",
                    borderRadius: 99,
                    marginLeft: 12,
                    flexShrink: 0,
                    overflow: "hidden",
                    padding: logo.cover ? 0 : 4,
                  }}
                >
                  <img
                    src={logo.uri}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: logo.cover ? "cover" : "contain",
                      filter: logo.invert ? "invert(1)" : "none",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
        <span style={{ fontFamily: "Merriweather Sans", fontWeight: 400, fontSize: 11, color: "rgba(60,56,54,0.7)" }}>
          @ashlynchaps
        </span>
      </div>

      {/* ── Decorative dots ── */}
      <div
        style={{
          position: "absolute",
          top: 28,
          right: 28,
          width: 10,
          height: 10,
          backgroundColor: "#458588",
          borderRadius: 99,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 46,
          right: 42,
          width: 7,
          height: 7,
          backgroundColor: "#cc241d",
          borderRadius: 99,
        }}
      />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------
(async () => {
  console.log(`Generating flyer for ${shows.length} show(s)…`);

  const svg = await satori(flyer, { width: totalWidth, height, fonts });

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: totalWidth * 2 } });
  const png = resvg.render().asPng();

  writeFileSync(outputFile, png);
  console.log(`✓ Saved ${outputFile} (${png.byteLength} bytes)`);
})();
