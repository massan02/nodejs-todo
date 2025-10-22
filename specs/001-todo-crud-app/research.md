# 研究ドキュメント: TODOアプリケーション

**フェーズ**: Phase 0（設計前調査）
**作成日**: 2025-10-22
**目的**: 技術選定根拠とベストプラクティス確認
**憲法バージョン**: 2.0.0

---

## 技術選定の根拠

### 1. フロントエンド: バニラ HTML5 + CSS3 + JavaScript (ES6+)

**決定**: バニラ（フレームワークなし）
**根拠**:
- 依存なし（npm/外部ライブラリ不要）
- ブラウザで直接実行可能（サーバー不要）
- シンプル（学習曲線なし）
- ファイルサイズ最小（高速起動）
- 憲法「シンプルさと実用性」に完全準拠

**検討した代替案**:
- React/Vue/Angular: 過機能、複雑度増加、ビルドプロセス必要
- jQuery: 古い、バニラ JavaScript で十分
- TypeScript: MVP では過度、バニラ JS で充分

---

### 2. ストレージ: ブラウザ LocalStorage

**決定**: ブラウザ LocalStorage
**根拠**:
- サーバー不要（完全クライアント側）
- セットアップ簡単（API シンプル）
- 容量十分（数百～数千タスク対応）
- すべてのブラウザで実装済み
- テスト簡単（同期的、メモリベース）

**検討した代替案**:
- サーバー + JSON ファイル: セットアップ複雑、依存増加
- IndexedDB: 複雑（LocalStorage で十分）
- Cloud Storage: 要件で不使用
- SQLite / DB: 過機能

**LocalStorage 容量**:
- 標準: 5～10MB per domain
- 1 タスク ≈ 300～500 bytes
- サポート最大: 10,000+ タスク ✓

---

### 3. アーキテクチャ: 単一 HTML + 3 JavaScript モジュール

**決定**: モジュール型バニラ JavaScript
```
index.html（単一ファイル）
   ↓
css/style.css          （スタイル）
   ↓
js/storage.js          （データ管理）
js/ui.js               （UI 操作）
js/app.js              （ロジック + 初期化）
```

**根拠**:
- モジュール分離（storage ↔ ui ↔ app）
- 循環依存なし（一方向依存）
- 各モジュール < 300 行（理解容易）
- 保守性・テスト性向上
- 憲法「モジュール独立性」に準拠

**モジュール責務**:
- `storage.js`: LocalStorage 読み書き（CRUD）
- `ui.js`: DOM 操作、イベントリスナー
- `app.js`: ページ遷移、ビジネスロジック、ストレージ + UI 連携

---

## UI/UX パターン

### 画面遷移（Client-side Routing）

バニラ JavaScript で実装:
```javascript
// app.js で管理
let currentPage = 'list'; // 'list' | 'create' | 'detail' | 'edit'

function navigate(page, taskId = null) {
  currentPage = page;
  render(); // UI 再描画
}

function render() {
  // 現在のページに応じて表示内容を切り替え
  document.getElementById('app').innerHTML =
    currentPage === 'list' ? renderListPage() :
    currentPage === 'create' ? renderCreatePage() :
    // ...
}
```

### イベント処理

HTML の onclick 属性か addEventListener で処理:
```javascript
// HTML: <button onclick="editTask('task-001')">編集</button>

function editTask(taskId) {
  const task = storage.getTask(taskId);
  navigate('edit', taskId);
  ui.renderForm(task);
}
```

---

## セキュリティ考慮事項

### XSS（クロスサイトスクリプティング）対策

**重要**: ユーザー入力を HTML に直接挿入しない

```javascript
// ❌ 危険: HTML 直接挿入
div.innerHTML = `<p>${task.title}</p>`;

// ✅ 安全: textContent を使用
div.textContent = task.title;
```

HTML エスケープヘルパー関数:
```javascript
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text; // HTML として解析されない
  return div.innerHTML;
}

// 使用例
div.innerHTML = `<p>${escapeHtml(task.title)}</p>`;
```

### CSRF 対策

なし（同一オリジン、外部通信なし）

### データ検証

クライアント側バリデーション:
```javascript
function validateTask(task) {
  if (!task.title || task.title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }
  if (task.title.length > 100) {
    return { valid: false, error: 'Title must be ≤ 100 chars' };
  }
  return { valid: true };
}
```

---

## パフォーマンス

### 読み込み性能

- HTML: < 50KB（圧縮時 < 20KB）
- CSS: < 10KB
- JavaScript: < 50KB（3 モジュール合計）
- **合計**: < 80KB（圧縮時 < 30KB）

**起動時間**: ブラウザで `index.html` 開いて < 500ms

### 実行時性能

- タスク作成: < 100ms（LocalStorage 書き込み）
- タスク読み込み: < 50ms（LocalStorage 読み込み）
- UI 再描画: < 100ms（100 タスク時）

---

## LocalStorage API リファレンス

```javascript
// 書き込み
localStorage.setItem('key', JSON.stringify(data));

// 読み込み
const data = JSON.parse(localStorage.getItem('key') || '[]');

// 削除
localStorage.removeItem('key');

// 全削除
localStorage.clear();

// キー列挙
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
}
```

---

## ブラウザ互換性

| ブラウザ | HTML5 | CSS3 | LocalStorage | ES6 |
|--------|-----|----|--------------|-----|
| Chrome | ✅ | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ | ✅ |
| Safari | ✅ | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ | ✅ |
| IE 11 | ⚠️ | ⚠️ | ✅ | ❌ |

**対応範囲**: IE 11 除く全モダンブラウザ

---

## 結論

すべての技術選定が以下に準拠：
- ✅ 憲法 v2.0.0「シンプルさと実用性」（フレームワーク不使用）
- ✅ 「モジュール独立性」（3 モジュール分離）
- ✅ 「インクリメンタルデリバリー」（段階実装可能）

次フェーズ（Phase 1）へ進行可能。
