# 藍怡婷 · 個人作品集

Astro + Tailwind CSS 打造的個人作品集網站。

## 本機開發

```bash
nvm use          # 使用 Node 22（讀取 .nvmrc）
npm install
npm run dev      # http://localhost:4321
```

## 新增作品（一鍵同步）

把原始素材放進 `image/` 對應資料夾，執行 `npm run sync` 即可：

| 資料夾 | 處理方式 |
| --- | --- |
| `image/web/` | 縮至寬 1600、品質 80 |
| `image/logo/` | 直接複製 |
| `image/video/` | H.264 壓縮（寬上限 1080）+ 自動產生同名縮圖 |

```bash
npm run sync     # 同步 image/ → src/assets/works/（只處理有變動的檔案）
npm run dev      # 或 npm run build 查看結果
```

作品集會自動抓取 `src/assets/works/` 內的所有檔案，不需修改程式碼。
（`image/` 為原始素材、已被 git 忽略；網站部署使用 `src/assets/works/` 內的處理後版本。）

## 建置

```bash
npm run build    # 輸出靜態檔到 dist/
npm run preview  # 預覽建置結果
```

## 部署到 Cloudflare Pages（Git 自動部署）

在 Cloudflare Pages 後台連接此 Git repo，建置設定如下：

| 設定項目 | 值 |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 由 `.nvmrc` 指定（22）|

每次 `git push` 到主分支，Cloudflare 會自動重新建置並部署。

> 註：原始未壓縮素材放在本機的 `image/` 資料夾（已被 git 忽略）；
> 網站實際使用的是 `public/` 內經過壓縮的版本。
