# クイックスタート: TODOアプリケーション開発

**対象**: 開発者向けセットアップガイド
**推定所要時間**: 2～5分
**憲法バージョン**: 2.0.0

---

## 前提条件

- モダンブラウザ（Chrome, Firefox, Safari, Edge）
- テキストエディタ / IDE（VS Code など）
- git（コミット用）

**不要**:
- Node.js
- npm / yarn
- ビルドツール
- 外部サーバー

---

## セットアップ手順

### 1. リポジトリクローン＆ブランチ切り替え

```bash
cd /path/to/nodejs-todo

# ブランチ確認（既に 001-todo-crud-app ブランチにいるはず）
git branch -a

# 必要に応じてブランチ切り替え
git checkout 001-todo-crud-app
```

### 2. プロジェクト構造確認

```bash
ls -la

# 以下のファイル構造を確認
index.html              # メイン HTML
css/style.css           # スタイル
js/
  ├── app.js            # メインロジック
  ├── storage.js        # LocalStorage 管理
  └── ui.js             # UI 操作
```

### 3. ブラウザで直接実行

```bash
# ブラウザで index.html を開く
open index.html

# または、簡易 HTTP サーバー起動（Python 3.x）
python3 -m http.server 8000

# ブラウザで http://localhost:8000 にアクセス
```

---

## ファイル構成

### index.html

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TODOアプリケーション</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="app"><!-- ここに UI が描画される --></div>

  <script src="js/storage.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

**重要**: スクリプトの読み込み順序（storage → ui → app）を守ること

### js/storage.js

```javascript
// LocalStorage を使用したデータ管理

const storage = {
  // タスク一覧取得
  getTasks() {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
  },

  // 単一タスク取得
  getTask(id) {
    const tasks = this.getTasks();
    return tasks.find(t => t.id === id);
  },

  // タスク保存
  saveTask(task) {
    const tasks = this.getTasks();
    const exists = tasks.find(t => t.id === task.id);
    if (exists) {
      // 既存タスク更新
      Object.assign(exists, task);
    } else {
      // 新規タスク追加
      tasks.push({
        id: Date.now().toString(), // 簡易 ID 生成
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
  },

  // タスク削除
  deleteTask(id) {
    const tasks = this.getTasks();
    localStorage.setItem('tasks', JSON.stringify(tasks.filter(t => t.id !== id)));
  }
};
```

### js/ui.js

```javascript
// DOM 操作と UI レンダリング

const ui = {
  // 一覧画面を描画
  renderListPage(tasks) {
    let html = '<h1>TODOリスト</h1>';
    html += '<button onclick="navigate(\'create\')">新規作成</button>';
    html += '<ul>';
    tasks.forEach(task => {
      html += `
        <li>
          <span onclick="navigate('detail', '${task.id}')">${task.title}</span>
          <button onclick="editTask('${task.id}')">編集</button>
          <button onclick="deleteTask('${task.id}')">削除</button>
        </li>
      `;
    });
    html += '</ul>';
    document.getElementById('app').innerHTML = html;
  },

  // 作成画面を描画
  renderCreatePage() {
    const html = `
      <h1>新規タスク作成</h1>
      <form onsubmit="handleCreateTask(event)">
        <input type="text" id="title" placeholder="タスク名" required maxlength="100">
        <textarea id="description" placeholder="説明" maxlength="500"></textarea>
        <button type="submit">保存</button>
        <button onclick="navigate('list')">キャンセル</button>
      </form>
    `;
    document.getElementById('app').innerHTML = html;
  },

  // その他の画面...
};
```

### js/app.js

```javascript
// アプリケーションロジック + 初期化

let currentPage = 'list';
let currentTaskId = null;

function navigate(page, taskId = null) {
  currentPage = page;
  currentTaskId = taskId;
  render();
}

function render() {
  const tasks = storage.getTasks();

  if (currentPage === 'list') {
    ui.renderListPage(tasks);
  } else if (currentPage === 'create') {
    ui.renderCreatePage();
  } else if (currentPage === 'detail') {
    const task = storage.getTask(currentTaskId);
    ui.renderDetailPage(task);
  } else if (currentPage === 'edit') {
    const task = storage.getTask(currentTaskId);
    ui.renderEditPage(task);
  }
}

function handleCreateTask(event) {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  storage.saveTask({ title, description, completed: false });
  navigate('list');
}

function editTask(taskId) {
  navigate('edit', taskId);
}

function deleteTask(taskId) {
  if (confirm('このタスクを削除しますか？')) {
    storage.deleteTask(taskId);
    navigate('list');
  }
}

// アプリケーション初期化
window.addEventListener('load', () => {
  render();
});
```

---

## 開発ワークフロー

### 1. 機能追加

```javascript
// 例: 完了フラグのトグル機能を追加

// Step 1: HTML に ボタン追加（ui.js）
html += `<button onclick="toggleCompleted('${task.id}')">
  ${task.completed ? '未完了' : '完了'}
</button>`;

// Step 2: handler 関数追加（app.js）
function toggleCompleted(taskId) {
  const task = storage.getTask(taskId);
  task.completed = !task.completed;
  task.updatedAt = new Date().toISOString();
  storage.saveTask(task);
  render();
}

// Step 3: テスト（ブラウザで手動確認）
// ブラウザ F12 → Console で
// storage.getTasks() を実行してデータ確認
```

### 2. スタイル編集

```css
/* css/style.css */
body {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

button {
  padding: 5px 10px;
  margin-left: 5px;
  cursor: pointer;
}
```

### 3. デバッグ

```javascript
// ブラウザ Console（F12）で以下を実行:

// すべてのタスク確認
console.log(storage.getTasks());

// 特定タスク確認
console.log(storage.getTask('task-id'));

// LocalStorage 直接確認
console.log(localStorage.getItem('tasks'));

// 手動テスト: タスク作成
storage.saveTask({ title: 'テスト', description: '', completed: false });
render();
```

---

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

### LocalStorage に データが保存されない

**原因**: file:// プロトコルでの実行（セキュリティ制限）

**解決**: HTTP サーバーを使用
```bash
python3 -m http.server 8000
# http://localhost:8000 でアクセス
```

### ページ遷移時にエラー

**原因**: `navigate()` 関数が定義されていない

**解決**: `app.js` が最後に読み込まれているか確認

---

## 次のステップ

1. **P1 実装**: タスク作成・表示機能（quickstart.md の例を参考）
2. **P2 実装**: 編集・削除機能
3. **P3 実装**: 複数画面ナビゲーション統合

詳細は [plan.md](plan.md) / [spec.md](spec.md) を参照。

---

## リソース

- [MDN: LocalStorage](https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage)
- [MDN: DOM Manipulation](https://developer.mozilla.org/ja/docs/Web/API/Document)
- 憲法: [constitution.md](../../.specify/memory/constitution.md)
