# UI 構造仕様: TODOアプリケーション

**作成日**: 2025-10-22
**対象**: フロントエンド HTML/CSS/JavaScript

---

## HTML 構造

### メインコンテナ

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
  <div id="app">
    <!-- 動的に生成される UI -->
  </div>

  <script src="js/storage.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

---

## ページ構成（4 画面）

### 画面 1: タスク一覧（list）

```html
<div class="page-list">
  <h1>TODOリスト</h1>

  <button onclick="navigate('create')" class="btn-primary">
    新規タスク作成
  </button>

  <ul id="task-list" class="task-list">
    <!-- 各タスク -->
    <li class="task-item" data-task-id="task-001">
      <span class="task-title" onclick="navigate('detail', 'task-001')">
        買い物に行く
      </span>
      <div class="task-actions">
        <button onclick="navigate('edit', 'task-001')" class="btn-edit">
          編集
        </button>
        <button onclick="deleteTask('task-001')" class="btn-delete">
          削除
        </button>
      </div>
    </li>
    <!-- ... その他のタスク -->
  </ul>

  <div id="empty-state" class="empty-state" style="display: none;">
    <p>タスクがありません</p>
  </div>
</div>
```

**イベント**:
- `navigate('create')`: タスク作成画面へ
- `navigate('detail', taskId)`: タスク詳細画面へ
- `navigate('edit', taskId)`: タスク編集画面へ
- `deleteTask(taskId)`: 削除確認 → タスク削除

---

### 画面 2: タスク作成（create）

```html
<div class="page-create">
  <h1>新規タスク作成</h1>

  <form id="create-form" onsubmit="handleCreateTask(event)">
    <div class="form-group">
      <label for="input-title">タスク名 *</label>
      <input
        type="text"
        id="input-title"
        name="title"
        placeholder="タスク名を入力（必須）"
        required
        maxlength="100"
        class="input-field"
      >
      <span class="char-count" id="title-count">0/100</span>
    </div>

    <div class="form-group">
      <label for="input-description">説明</label>
      <textarea
        id="input-description"
        name="description"
        placeholder="説明を入力（オプション）"
        maxlength="500"
        rows="4"
        class="input-field"
      ></textarea>
      <span class="char-count" id="description-count">0/500</span>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn-primary">保存</button>
      <button type="button" onclick="navigate('list')" class="btn-secondary">
        キャンセル
      </button>
    </div>
  </form>

  <div id="error-message" class="error-message" style="display: none;"></div>
</div>
```

**イベント**:
- `handleCreateTask(event)`: フォーム送信 → タスク保存 → 一覧へ
- `navigate('list')`: キャンセル → 一覧へ戻る
- 入力フィールド `oninput`: 文字数カウント表示

---

### 画面 3: タスク詳細（detail）

```html
<div class="page-detail">
  <h1 id="detail-title">買い物に行く</h1>

  <div class="task-info">
    <div class="info-item">
      <strong>説明:</strong>
      <p id="detail-description">スーパーで牛乳を買う</p>
    </div>

    <div class="info-item">
      <strong>ステータス:</strong>
      <span id="detail-status" class="status-badge">未完了</span>
    </div>

    <div class="info-item">
      <strong>作成日時:</strong>
      <p id="detail-created">2025-10-22 09:15:00</p>
    </div>

    <div class="info-item">
      <strong>更新日時:</strong>
      <p id="detail-updated">2025-10-22 10:30:00</p>
    </div>
  </div>

  <div class="task-actions">
    <button onclick="navigate('edit', currentTaskId)" class="btn-primary">
      編集
    </button>
    <button onclick="navigate('list')" class="btn-secondary">
      一覧へ戻る
    </button>
  </div>
</div>
```

**イベント**:
- `navigate('edit', currentTaskId)`: 編集画面へ
- `navigate('list')`: 一覧へ戻る

---

### 画面 4: タスク編集（edit）

```html
<div class="page-edit">
  <h1>タスク編集</h1>

  <form id="edit-form" onsubmit="handleUpdateTask(event)">
    <div class="form-group">
      <label for="edit-title">タスク名 *</label>
      <input
        type="text"
        id="edit-title"
        name="title"
        required
        maxlength="100"
        class="input-field"
      >
    </div>

    <div class="form-group">
      <label for="edit-description">説明</label>
      <textarea
        id="edit-description"
        name="description"
        maxlength="500"
        rows="4"
        class="input-field"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="edit-completed">
        <input type="checkbox" id="edit-completed" name="completed">
        完了
      </label>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn-primary">保存</button>
      <button type="button" onclick="deleteTask(currentTaskId)" class="btn-danger">
        削除
      </button>
      <button type="button" onclick="navigate('detail', currentTaskId)" class="btn-secondary">
        キャンセル
      </button>
    </div>
  </form>

  <div id="edit-error" class="error-message" style="display: none;"></div>
</div>
```

**イベント**:
- `handleUpdateTask(event)`: フォーム送信 → タスク更新 → 詳細へ
- `deleteTask(taskId)`: 削除確認 → 削除 → 一覧へ
- `navigate('detail', currentTaskId)`: キャンセル → 詳細へ戻る

---

## JavaScript イベントハンドラー

### navigate(page, taskId)

ページを切り替える（クライアント側ルーティング）

```javascript
function navigate(page, taskId = null) {
  currentPage = page;
  currentTaskId = taskId;
  render();
  window.scrollTo(0, 0); // ページ上部へスクロール
}
```

### handleCreateTask(event)

新規タスク作成

```javascript
function handleCreateTask(event) {
  event.preventDefault();

  const title = document.getElementById('input-title').value.trim();
  const description = document.getElementById('input-description').value.trim();

  // バリデーション
  if (!title) {
    showError('タイトルは必須です');
    return;
  }

  // 保存
  storage.saveTask({
    title,
    description,
    completed: false
  });

  navigate('list');
}
```

### handleUpdateTask(event)

既存タスク更新

```javascript
function handleUpdateTask(event) {
  event.preventDefault();

  const title = document.getElementById('edit-title').value.trim();
  const description = document.getElementById('edit-description').value.trim();
  const completed = document.getElementById('edit-completed').checked;

  // バリデーション
  if (!title) {
    showError('タイトルは必須です');
    return;
  }

  // 更新
  const task = storage.getTask(currentTaskId);
  task.title = title;
  task.description = description;
  task.completed = completed;
  storage.saveTask(task);

  navigate('detail', currentTaskId);
}
```

### deleteTask(taskId)

タスク削除

```javascript
function deleteTask(taskId) {
  if (confirm('このタスクを削除しますか？')) {
    storage.deleteTask(taskId);
    navigate('list');
  }
}
```

---

## CSS クラス

### レイアウト

```css
.page-list, .page-create, .page-detail, .page-edit {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: bold;
}

.input-field {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
```

### ボタン

```css
.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-edit {
  background-color: #ffc107;
  color: black;
  padding: 5px 10px;
  font-size: 0.9em;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  padding: 5px 10px;
  font-size: 0.9em;
}
```

### リスト表示

```css
.task-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

.task-title {
  cursor: pointer;
  color: #007bff;
  text-decoration: underline;
}

.task-title:hover {
  color: #0056b3;
}

.task-actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}
```

### メッセージ

```css
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
}

.char-count {
  font-size: 0.85em;
  color: #666;
  margin-top: 4px;
}
```

---

## データバインディング

フォーム編集時のプリフィル:

```javascript
function renderEditPage() {
  const task = storage.getTask(currentTaskId);

  // フォームに既存値を入力
  document.getElementById('edit-title').value = task.title;
  document.getElementById('edit-description').value = task.description;
  document.getElementById('edit-completed').checked = task.completed;
}
```

---

## ナビゲーションマップ

```
[一覧] ←→ [作成]
  ↓   ↘
[詳細] ←→ [編集]
  ↓
[削除] → [一覧]
```

| 遷移元 | 遷移先 | トリガー |
|------|------|--------|
| 一覧 | 作成 | "新規作成" ボタン |
| 一覧 | 詳細 | タスク名クリック |
| 一覧 | 編集 | タスク行の "編集" ボタン |
| 作成 | 一覧 | "保存" または "キャンセル" |
| 詳細 | 編集 | "編集" ボタン |
| 詳細 | 一覧 | "一覧へ戻る" ボタン |
| 編集 | 詳細 | "保存" ボタン（成功時） |
| 編集 | 一覧 | "キャンセル" または "削除後" |
