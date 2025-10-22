# 開発ガイド - TODOアプリケーション

このドキュメントは、TODOアプリケーションの開発に参加する開発者向けのガイドです。

## 開発環境セットアップ

### 前提条件

- Git
- モダンブラウザ（Chrome, Firefox, Safari, Edge）
- テキストエディタ / IDE（VS Code 推奨）

### セットアップ手順

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd nodejs-todo

# 2. ブランチを確認
git branch -a

# 3. 該当ブランチに切り替え（例: 機能開発用）
git checkout 001-todo-crud-app

# 4. ブラウザで開く
open index.html
# または HTTP サーバーで起動
python3 -m http.server 8000
```

## プロジェクト構造

```
.
├── index.html                      # メイン HTML
├── css/
│   └── style.css                   # スタイル
├── js/
│   ├── storage.js                  # LocalStorage モジュール
│   ├── ui.js                       # UI レンダリングモジュール
│   └── app.js                      # アプリケーションロジック
├── specs/
│   └── 001-todo-crud-app/          # 機能仕様書
│       ├── spec.md                 # 機能仕様
│       ├── plan.md                 # 実装計画
│       ├── tasks.md                # 実装タスク
│       ├── data-model.md           # データモデル
│       ├── quickstart.md           # クイックスタート
│       └── contracts/
│           └── ui-structure.md     # UI 構造仕様
├── README.md                       # プロジェクト概要
├── CONTRIBUTING.md                 # このファイル
└── .gitignore                      # Git 無視設定
```

## モジュール設計と責務

### 1. storage.js - LocalStorage 管理

**責務**: ブラウザ LocalStorage との読み書きを担当

```javascript
const storage = {
  // すべてのタスクを取得
  getTasks()

  // ID でタスクを取得
  getTask(id)

  // タスクを保存（新規作成・更新）
  saveTask(task)

  // タスクを削除
  deleteTask(id)
};
```

**特徴**:
- LocalStorage キー: `'tasks'`
- JSON で保存
- 同期処理（非同期なし）
- 100 行以下の小さなモジュール

### 2. ui.js - UI レンダリング

**責務**: HTML 生成とページレイアウト

```javascript
const ui = {
  // タスク一覧画面を生成
  renderListPage(tasks)

  // タスク作成画面を生成
  renderCreatePage()

  // タスク詳細画面を生成
  renderDetailPage(task)

  // タスク編集画面を生成
  renderEditPage(task)

  // HTML エスケープ（XSS 対策）
  escapeHtml(text)

  // 日時フォーマット
  formatDateTime(isoString)
};
```

**特徴**:
- HTML 文字列を返す
- `storage` に依存しない（関数呼び出しではなく参照）
- テンプレートリテラルで HTML 生成
- 200 行以下

### 3. app.js - アプリケーションロジック

**責務**: ページ遷移、イベント処理、ビジネスロジック

```javascript
// グローバル状態
let currentPage = 'list';
let currentTaskId = null;

// ページ遷移
function navigate(page, taskId = null)

// 画面をレンダリング
function render()

// タスク作成処理
function handleCreateTask(event)

// タスク更新処理
function handleUpdateTask(event)

// タスク削除処理
function deleteTask(taskId)

// 文字数カウント更新
function updateCharCount(field)

// アプリ初期化
window.addEventListener('load', () => { render(); });
```

**特徴**:
- グローバル状態管理
- `storage` と `ui` の連携
- イベントハンドラー
- バリデーションロジック

## 依存関係

```
app.js
  ↓
 ├─→ storage.js（データ管理）
 └─→ ui.js（UI 生成）

storage.js
  （依存なし）

ui.js
  （storage に依存しない）
```

**循環依存なし**が原則です。

## コーディングガイドライン

### 1. ファイルサイズ

- 各 JavaScript ファイル: < 300 行
- 関数: < 50 行（目安）

### 2. 命名規則

```javascript
// 関数: キャメルケース
function handleCreateTask() {}
function updateCharCount() {}

// 定数: スネークケース
const STORAGE_KEY = 'tasks';
const MAX_TITLE_LENGTH = 100;

// クラス/オブジェクト: パスカルケース
const Storage = {};
const UI = {};
```

### 3. バリデーション

```javascript
// 必須: タスク名
if (!title || title.trim().length === 0) {
  showError('タスク名は必須です');
  return;
}

// 長さ制限
if (title.length > 100) {
  showError('タスク名は100文字以下にしてください');
  return;
}
```

### 4. エラーハンドリング

```javascript
// ユーザーへのフィードバックは必須
try {
  storage.saveTask(task);
} catch (error) {
  console.error('タスク保存エラー:', error);
  showError('タスクを保存できませんでした');
}
```

### 5. セキュリティ

```javascript
// ❌ 危険: HTML インジェクション
div.innerHTML = `<p>${task.title}</p>`;

// ✅ 安全: HTML エスケープ
div.innerHTML = `<p>${ui.escapeHtml(task.title)}</p>`;

// ✅ より安全: textContent を使用
div.textContent = task.title;
```

### 6. コメント

```javascript
// 複雑なロジックには説明を追加
// シンプルなコードはコメント不要

// 例: バリデーション前の trim()
const title = document.getElementById('input-title').value.trim();

// 例: 複雑なロジックには説明を追加
// LocalStorage に JSON として保存するため、
// 日時は ISO 8601 形式で格納
task.updatedAt = new Date().toISOString();
```

## テスト方法

### 手動テスト（ブラウザで）

```javascript
// 1. ブラウザ DevTools を開く（F12）
// 2. Console タブで以下を実行

// すべてのタスク確認
console.log(storage.getTasks());

// テストタスクを追加
storage.saveTask({
  title: 'テストタスク',
  description: 'テスト用',
  completed: false
});

// 画面を再描画して確認
render();

// タスクを編集
const tasks = storage.getTasks();
const firstTask = tasks[0];
firstTask.title = '更新テスト';
storage.saveTask(firstTask);
render();

// タスクを削除
storage.deleteTask(tasks[0].id);
render();

// LocalStorage を確認
console.log(localStorage.getItem('tasks'));
```

### 手動テストシナリオ

#### シナリオ 1: タスク作成・表示
```
1. ページを開く → 「TODOリスト」表示
2. 「新規タスク作成」ボタン → 作成画面表示
3. タスク情報を入力 → 「保存」
4. 一覧に新規タスク表示 ✅
5. ページリロード → タスク保持 ✅
```

#### シナリオ 2: タスク編集
```
1. タスク一覧で「編集」ボタン → 編集画面表示
2. 既存値がプリフィル ✅
3. 情報を変更 → 「保存」
4. 詳細画面で変更が反映 ✅
```

#### シナリオ 3: タスク削除
```
1. タスク一覧で「削除」ボタン
2. 確認ダイアログ表示
3. 「OK」をクリック
4. タスク削除 ✅
5. 一覧から消える ✅
```

#### シナリオ 4: ページ遷移
```
1. 一覧 → 作成 → 一覧 ✅
2. 一覧 → 詳細 ✅
3. 詳細 → 編集 ✅
4. 編集 → 詳細 ✅
5. どの画面からでも一覧に戻れる ✅
```

### デバッグのコツ

```javascript
// localStorage をクリア（テスト用）
localStorage.clear();
render();

// 特定のタスクを検索
const tasks = storage.getTasks();
tasks.find(t => t.title.includes('キーワード'));

// 作成日時の古い順
tasks.sort((a, b) =>
  new Date(a.createdAt) - new Date(b.createdAt)
);

// グローバル状態を確認
console.log({ currentPage, currentTaskId });
```

## Git ワークフロー

### コミットメッセージ

```
[修正] 機能概要（日本語）

- 詳細な変更内容（複数行可）
- 修正の背景や理由
```

**プリフィックス**:
- `[機能]` - 新機能追加
- `[修正]` - バグ修正
- `[改善]` - パフォーマンス改善
- `[ドキュメント]` - ドキュメント更新
- `[リファクタリング]` - コード整理

### 例

```bash
git add .

git commit -m "[機能] タスク完了フラグの実装

- 編集画面に「完了」チェックボックスを追加
- タスク詳細画面でステータス表示
- 完了タスクは一覧で視覚的に区別"

git push origin 001-todo-crud-app
```

## パフォーマンス最適化

### やること

- ✅ LocalStorage の読み書き最小化
- ✅ DOM 操作の集約（`innerHTML` は 1 回）
- ✅ 不要なイベントリスナーの削除
- ✅ 大量タスク時の描画最適化

### やらないこと（MVP では）

- ❌ 仮想スクロール（タスク数が少ないため）
- ❌ Web Workers（シンプル化のため）
- ❌ Service Worker（MVP では不要）

## セキュリティチェックリスト

- [ ] ユーザー入力は HTML エスケープされているか
- [ ] `textContent` と `innerHTML` を適切に使い分けているか
- [ ] LocalStorage に機密情報は保存されていないか
- [ ] CSRF トークンは不要か（同一オリジン）
- [ ] バリデーションエラーは適切にハンドルされているか

## トラブルシューティング

### "Uncaught ReferenceError: storage is not defined"

**原因**: スクリプト読み込み順序が間違っている

**解決**:
```html
<!-- 正しい順序 -->
<script src="js/storage.js"></script>
<script src="js/ui.js"></script>
<script src="js/app.js"></script>
```

### LocalStorage に保存されない

**原因**: `file://` プロトコルでの実行

**解決**:
```bash
python3 -m http.server 8000
# http://localhost:8000 でアクセス
```

### ページ遷移後、フォーム値が空

**原因**: `render()` が毎回すべて生成し直しているため、フォーム値が初期化される

**仕様**: これは正しい動作です。編集画面は `renderEditPage()` で既存値をプリフィルしています

## よくある質問

### Q: データベースは必要か?

A: MVP では不要です。LocalStorage で十分。将来、複数ユーザー対応時に検討してください。

### Q: API サーバーは必要か?

A: 不要です。完全なクライアント側実装が設計目標です。

### Q: テストフレームワークは?

A: 憲法 v2.0.0 では TDD を削除したため、手動テストで十分です。

### Q: TypeScript は?

A: バニラ JavaScript で実装します。シンプルさが優先です。

## 参考資料

- [README.md](README.md) - プロジェクト概要
- [specs/001-todo-crud-app/spec.md](specs/001-todo-crud-app/spec.md) - 機能仕様
- [specs/001-todo-crud-app/tasks.md](specs/001-todo-crud-app/tasks.md) - 実装タスク
- [MDN: LocalStorage](https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage)
- [MDN: DOM 操作](https://developer.mozilla.org/ja/docs/Web/API/Document)

## サポート

質問やバグ報告は GitHub Issues で報告してください。

---

**最後に更新**: 2025-10-22

Happy Coding! 🚀
