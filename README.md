# PaintMix — 絵の具の混色Webアプリ

ReactとTypeScriptを使用して開発した、絵の具の混色をシミュレーションするWebアプリケーションです。

**公開デモ：** https://paint.art-full-stack.com

## 概要

PaintMixは、複数の絵の具の色を混ぜ合わせたときの色の変化をブラウザ上で確認できるWebアプリケーションです。

ReactによるUI設計とTypeScriptによる型安全性を意識し、保守性と拡張性を考慮して開発しています。

## 主な機能

- 絵の具の色を混ぜ合わせる混色機能
- 混色結果のリアルタイムプレビュー
- ブラウザ上で動作するインターフェース

## 使用技術

- React
- TypeScript
- Vite
- Mixbox 2.0.0

## 開発環境の構築

### 必要な環境

- Node.js
- npm

### インストール

```bash
git clone https://github.com/TakahiroNago/paint-mix-app.git
cd paint-mix-app
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

### 本番用ビルド

```bash
npm run build
```

### ビルド結果の確認

```bash
npm run preview
```

## 混色エンジンについて

混色処理には、絵の具の混色をシミュレーションするMixboxを使用しています。

Mixboxは外部ライブラリです。利用条件やライセンスについては、公式のドキュメントおよびライセンス情報を参照してください。

## ライセンス

本プロジェクトのソースコードおよび利用している外部ライブラリのライセンス条件については、それぞれのライセンス情報を確認してください。
