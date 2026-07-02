# 藍怡婷 · 個人作品集

Astro + Tailwind CSS 打造的個人作品集網站。

## 本機開發

```bash
nvm use          # 使用 Node 22（讀取 .nvmrc）
npm install
npm run dev      # http://localhost:4321
```

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
