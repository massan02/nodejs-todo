# 実装計画: TODOアプリケーション

**ブランチ**: `001-todo-crud-app` | **日付**: 2025-10-22 | **仕様**: [spec.md](spec.md)
**入力**: 機能仕様書 `/specs/001-todo-crud-app/spec.md`
**憲法バージョン**: 2.0.0（テスト駆動開発・CLI優先インターフェース削除）

**備考**: このドキュメントは `/speckit.plan` コマンドで作成されました。実行ワークフロー詳細は `.specify/templates/commands/plan.md` を参照。

## 概要

バニラ HTML/CSS/JavaScript で実装したシンプルな TODOアプリケーション。ブラウザ LocalStorage を使用してデータを永続化。複数の UI 画面（作成、一覧、詳細、編集）を提供し、ユーザーがタスクの CRUD 操作を効率的に実行できる。

**特徴**:
- フレームワーク不使用（バニラ HTML/CSS/JS のみ）
- ブラウザの LocalStorage で永続化
- サーバーレス（サーバー不要）
- 依存なし（npm 不要）
- ファイルを直接ブラウザで開くだけで動作

憲法で定義された「シンプルさと実用性」「モジュール独立性」「インクリメンタルデリバリー」の原則に従う。

## 技術コンテキスト

**言語**: HTML5 + CSS3 + JavaScript（ES6）
**ストレージ**: ブラウザ LocalStorage
**サーバー**: なし（完全なクライアント側実装）
**依存関係**: なし（外部ライブラリ不使用）
**ターゲットプラットフォーム**: ウェブブラウザ（Chrome, Firefox, Safari, Edge）
**プロジェクトタイプ**: スタンドアロン Web アプリケーション
**パフォーマンス目標**: タスク作成 < 100ms、一覧読み込み < 500ms（100タスク）
**制約**: フレームワーク・サーバー・外部依存不使用
**スケール/スコープ**: 単一ユーザー、数百タスク規模（LocalStorage 容量まで）

## 憲法チェック

*ゲート: Phase 0 研究前に合格必須。Phase 1 設計後に再チェック。*

### 合格項目 ✅

1. **I. シンプルさと実用性**:
   - バニラ HTML/CSS/JavaScript のみ使用
   - フレームワーク・依存なし
   - ブラウザ LocalStorage で永続化
   - ファイルをブラウザで直接開くだけで動作

2. **II. モジュール独立性**:
   - storage（LocalStorage 管理）、ui（UI 操作）、app（アプリケーションロジック）の 3 モジュール分離
   - 循環依存なし
   - 各モジュール < 300 行

3. **III. インクリメンタルデリバリー**:
   - P1 (タスク作成・表示) → P2 (編集・削除) → P3 (ナビゲーション) の段階的実装
   - 各ステップで独立してテスト可能
   - 各ステップで価値提供可能

### 削除された原則（v2.0.0 準拠）

- ~~II. テスト駆動開発~~: 削除
- ~~III. CLI優先インターフェース~~: 削除

### 違反項目

なし。この計画は憲法 v2.0.0 の 3 つの中核原則にすべて準拠。

## プロジェクト構造

### ドキュメント（この機能）

```text
specs/001-todo-crud-app/
├── plan.md              # このファイル（/speckit.plan コマンド出力）
├── spec.md              # 機能仕様書
├── research.md          # Phase 0 出力（技術選定根拠）
├── data-model.md        # Phase 1 出力（Task データモデル）
├── quickstart.md        # Phase 1 出力（開発ガイド）
├── contracts/           # Phase 1 出力
│   └── ui-structure.md  # HTML 構造 + イベント仕様
├── checklists/
│   └── requirements.md   # 仕様品質チェック
└── tasks.md             # Phase 2 出力（/speckit.tasks コマンド）
```

### ソースコード（リポジトリルート）

```text
index.html              # メイン HTML（単一ファイル）
├── includes:
│   ├── css/style.css   # スタイル（<link> で読み込み）
│   └── js/app.js       # JavaScript（<script> で読み込み）

css/
└── style.css           # アプリケーションスタイル

js/
├── app.js              # メインアプリケーション（状態管理 + イベント）
├── storage.js          # LocalStorage ラッパーモジュール
└── ui.js               # UI 操作・レンダリングモジュール

README.md               # ドキュメント
CONTRIBUTING.md         # 開発ガイド
```

**ファイル数**: 5～7 個（極シンプル）

**構造決定**: スタンドアロン Web アプリケーション
- 理由: フレームワーク・サーバー・依存なしで最もシンプル
- 利点: ブラウザで `index.html` を直接開くだけで動作
- JavaScript モジュール: 3 個（storage, ui, app）で明確に分離
- 各モジュール < 300 行で理解容易

## 複雑度トラッキング

このプランは憲法違反がないため、このセクションは不要です。

---

## Phase 0: 研究と設計 ✅ 完了

以下のドキュメントを新設計で生成：

1. **research.md** ✅ - 技術選定根拠（バニラ HTML/CSS/JS, LocalStorage）
2. **data-model.md** ✅ - Task データモデル詳細
3. **contracts/ui-structure.md** ✅ - HTML 構造とイベント仕様
4. **quickstart.md** ✅ - 開発者向けセットアップ手順

### Phase 0 成果物

- [research.md](research.md): バニラ HTML/CSS/JS + LocalStorage の設計根拠
- [data-model.md](data-model.md): Task エンティティ（id, title, description, completed, createdAt, updatedAt）
- [contracts/ui-structure.md](contracts/ui-structure.md): 4 画面（一覧/作成/詳細/編集）の HTML 構造とイベント仕様
- [quickstart.md](quickstart.md): セットアップ手順と開発ガイド

---

## Phase 1: 詳細設計 → Phase 2 実装へ

計画の検証完了。以下のコマンドで次フェーズへ：

```bash
/speckit.tasks
```

このコマンドが以下を生成予定：

- **tasks.md** - 実装タスク一覧
  - Phase 1: セットアップ（ディレクトリ・ファイル作成）
  - Phase 2: 基盤実装（storage.js, ui.js モジュール作成）
  - Phase 3: P1 実装（タスク作成と表示） - 独立してテスト可能
  - Phase 4: P2 実装（タスク編集と削除） - P3 後に実装
  - Phase 5: P3 実装（複数画面ナビゲーション）
  - Phase N: ドキュメント・ポーランド

---

## チェックポイント：憲法コンプライアンス最終確認（v2.0.0）

この計画は以下を完全に満たす：

| 原則 | 要件 | 充足状況 |
|------|------|--------|
| I. シンプルさと実用性 | バニラ JS、フレームワーク不使用、300行/ファイル | ✅ |
| II. モジュール独立性 | 3 モジュール分離（storage, ui, app）、循環依存なし | ✅ |
| III. インクリメンタルデリバリー | P1→P2→P3 段階実装、各ステップで独立テスト可能 | ✅ |

---

## 生成フェーズサマリー

**フェーズ**: Phase 0 ✅ + Phase 1 準備中
**憲法バージョン**: 2.0.0（テスト・CLI 原則削除）
**状態**: 実装準備完了（Phase 2 タスク化待機）
**次ステップ**: `/speckit.tasks` で実装タスク生成
