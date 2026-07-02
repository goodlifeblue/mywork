// 一鍵同步作品素材：image/ → src/assets/works/
//   web   ：縮至寬 1600、品質 80
//   logo  ：直接複製
//   video ：H.264 CRF 24 壓縮（寬上限 1080）+ 產生同名縮圖
// 只處理「來源比輸出新」或「輸出不存在」的檔案，重跑很快。
//
// 用法：npm run sync

import {
  readdirSync,
  mkdirSync,
  copyFileSync,
  existsSync,
  statSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

let ffmpeg;
try {
  ffmpeg = require("ffmpeg-static");
} catch {
  ffmpeg = null;
}

const SRC = "image";
const OUT = "src/assets/works";
const IMG_EXT = /\.(jpe?g|png|webp)$/i;

let counts = { web: 0, logo: 0, video: 0, skipped: 0 };

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function isNewer(src, out) {
  // 輸出不存在，或來源比輸出新 → 需要處理
  if (!existsSync(out)) return true;
  return statSync(src).mtimeMs > statSync(out).mtimeMs;
}

function listFiles(dir, filterRe) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => filterRe.test(f) && !f.startsWith("."))
    .sort();
}

// --- 網頁圖：縮至寬 1600、品質 80 ---
function syncWeb() {
  const srcDir = path.join(SRC, "web");
  const outDir = path.join(OUT, "web");
  ensureDir(outDir);
  for (const file of listFiles(srcDir, IMG_EXT)) {
    const src = path.join(srcDir, file);
    const out = path.join(outDir, file);
    if (!isNewer(src, out)) {
      counts.skipped++;
      continue;
    }
    execFileSync(ffmpeg, [
      "-y", "-i", src,
      "-vf", "scale='min(1600,iw)':-2",
      "-q:v", "4",
      out,
    ], { stdio: "ignore" });
    console.log(`  🌐 web/${file}`);
    counts.web++;
  }
}

// --- Logo：直接複製 ---
function syncLogo() {
  const srcDir = path.join(SRC, "logo");
  const outDir = path.join(OUT, "logo");
  ensureDir(outDir);
  for (const file of listFiles(srcDir, IMG_EXT)) {
    const src = path.join(srcDir, file);
    const out = path.join(outDir, file);
    if (!isNewer(src, out)) {
      counts.skipped++;
      continue;
    }
    copyFileSync(src, out);
    console.log(`  ✏️  logo/${file}`);
    counts.logo++;
  }
}

// --- 影片：壓縮 + 縮圖 ---
function syncVideo() {
  const srcDir = path.join(SRC, "video");
  const outDir = path.join(OUT, "video");
  ensureDir(outDir);
  for (const file of listFiles(srcDir, /\.(mp4|mov|m4v|webm)$/i)) {
    const base = file.replace(/\.[^.]+$/, "");
    const src = path.join(srcDir, file);
    const outVideo = path.join(outDir, `${base}.mp4`);
    const outPoster = path.join(outDir, `${base}.jpg`);
    if (!isNewer(src, outVideo)) {
      counts.skipped++;
      continue;
    }
    // 壓縮影片
    execFileSync(ffmpeg, [
      "-y", "-i", src,
      "-c:v", "libx264", "-preset", "slow", "-crf", "24",
      "-pix_fmt", "yuv420p",
      "-vf", "scale='min(1080,iw)':-2",
      "-movflags", "+faststart",
      "-an",
      outVideo,
    ], { stdio: "ignore" });
    // 產生縮圖（第 0.5 秒）
    execFileSync(ffmpeg, [
      "-y", "-i", outVideo,
      "-ss", "0.5", "-frames:v", "1", "-q:v", "4",
      outPoster,
    ], { stdio: "ignore" });
    console.log(`  🎬 video/${base}.mp4 (+ 縮圖)`);
    counts.video++;
  }
}

// --- 執行 ---
if (!ffmpeg) {
  console.error("❌ 找不到 ffmpeg，請先執行：npm install");
  process.exit(1);
}
if (!existsSync(SRC)) {
  console.error(`❌ 找不到來源資料夾 ${SRC}/，請確認素材放在 image/web、image/logo、image/video`);
  process.exit(1);
}

console.log("🔄 同步作品素材 image/ → src/assets/works/ ...\n");
syncWeb();
syncLogo();
syncVideo();

const changed = counts.web + counts.logo + counts.video;
console.log(
  `\n✅ 完成：web ${counts.web}、logo ${counts.logo}、video ${counts.video}` +
    `（略過未變動 ${counts.skipped} 個）`
);
if (changed > 0) console.log("👉 執行 npm run build 或 npm run dev 即可看到更新");
