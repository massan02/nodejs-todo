# REST API 契約: TODOアプリケーション

**ベースURL**: `http://localhost:3000/api`
**バージョン**: v1
**形式**: JSON

---

## エンドポイント一覧

### タスク一覧取得

```
GET /tasks
```

**説明**: すべてのタスクを取得

**クエリパラメータ**: なし

**レスポンス**:

```json
{
  "status": "success",
  "data": [
    {
      "id": "task-001",
      "title": "買い物",
      "description": "牛乳を買う",
      "completed": false,
      "createdAt": "2025-10-22T09:00:00Z",
      "updatedAt": "2025-10-22T09:00:00Z"
    }
  ]
}
```

**ステータスコード**:
- `200 OK`: 成功（タスクがない場合は空配列）
- `500 Internal Server Error`: サーバーエラー

---

### タスク単件取得

```
GET /tasks/:id
```

**説明**: ID でタスクを取得

**パラメータ**:
- `id` (URL path): タスク ID

**レスポンス**:

```json
{
  "status": "success",
  "data": {
    "id": "task-001",
    "title": "買い物",
    "description": "牛乳を買う",
    "completed": false,
    "createdAt": "2025-10-22T09:00:00Z",
    "updatedAt": "2025-10-22T09:00:00Z"
  }
}
```

**ステータスコード**:
- `200 OK`: 成功
- `404 Not Found`: タスクが見つからない
- `500 Internal Server Error`: サーバーエラー

---

### タスク作成

```
POST /tasks
```

**説明**: 新しいタスクを作成

**リクエストボディ**:

```json
{
  "title": "買い物",
  "description": "牛乳を買う"
}
```

**必須フィールド**: `title`
**オプション**: `description`

**レスポンス**:

```json
{
  "status": "success",
  "data": {
    "id": "task-001",
    "title": "買い物",
    "description": "牛乳を買う",
    "completed": false,
    "createdAt": "2025-10-22T09:00:00Z",
    "updatedAt": "2025-10-22T09:00:00Z"
  }
}
```

**ステータスコード**:
- `201 Created`: 成功
- `400 Bad Request`: 入力エラー（title が空など）
- `500 Internal Server Error`: サーバーエラー

---

### タスク更新

```
PUT /tasks/:id
```

**説明**: 既存タスクを更新

**パラメータ**:
- `id` (URL path): タスク ID

**リクエストボディ**:

```json
{
  "title": "買い物（更新版）",
  "description": "牛乳とパンを買う",
  "completed": true
}
```

**更新可能フィールド**: `title`, `description`, `completed`
**自動更新**: `updatedAt` はサーバーで自動更新

**レスポンス**:

```json
{
  "status": "success",
  "data": {
    "id": "task-001",
    "title": "買い物（更新版）",
    "description": "牛乳とパンを買う",
    "completed": true,
    "createdAt": "2025-10-22T09:00:00Z",
    "updatedAt": "2025-10-22T10:00:00Z"
  }
}
```

**ステータスコード**:
- `200 OK`: 成功
- `400 Bad Request`: 入力エラー
- `404 Not Found`: タスクが見つからない
- `500 Internal Server Error`: サーバーエラー

---

### タスク削除

```
DELETE /tasks/:id
```

**説明**: タスクを削除

**パラメータ**:
- `id` (URL path): タスク ID

**レスポンス**:

```json
{
  "status": "success",
  "message": "Task deleted successfully"
}
```

**ステータスコード**:
- `200 OK`: 成功
- `404 Not Found`: タスクが見つからない
- `500 Internal Server Error`: サーバーエラー

---

## エラーレスポンス

すべてのエンドポイントでエラー時：

```json
{
  "status": "error",
  "message": "エラーの説明",
  "code": "ERROR_CODE"
}
```

**共通エラーコード**:
- `VALIDATION_ERROR`: 入力バリデーションエラー
- `NOT_FOUND`: リソースが見つからない
- `SERVER_ERROR`: サーバー内部エラー

---

## レスポンスフォーマット

### 成功時

```json
{
  "status": "success",
  "data": { ... } または [ ... ]
}
```

### エラー時

```json
{
  "status": "error",
  "message": "エラーメッセージ",
  "code": "エラーコード"
}
```

---

## バリデーション

### title フィールド

- 必須
- 1～100文字
- 空文字列は許可されない

### description フィールド

- オプション
- 最大500文字

### completed フィールド

- ブール値のみ受け入れ
