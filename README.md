# TODOアプリケーション

これは学校の課題で作成したTodoアプリケーションです HTML/CSS/JavaScript,Spec Kit,Claude Codeを用いて作成されました　以下はAIが生成した生成文です（この一文はmassan02が書きました）

シンプルで実用的なバニラ HTML/CSS/JavaScript で実装された TODO アプリケーションです。サーバーレス、フレームワーク不使用で、ブラウザの LocalStorage を使用してタスクを永続化します。

## 特徴

- 🎯 **フレームワークなし**: バニラ HTML5、CSS3、JavaScript のみ
- 💾 **サーバーレス**: ブラウザ LocalStorage で完全オフライン対応
- 📁 **ファイルベース**: `index.html` をブラウザで開くだけで動作
- 🚀 **軽量**: 依存なし、npm 不要
- 📱 **レスポンシブ**: デスクトップ、タブレット、モバイル対応
- ✅ **完全な CRUD**: タスクの作成、表示、編集、削除に対応

## セットアップ

### 前提条件

- モダンブラウザ（Chrome, Firefox, Safari, Edge）
- テキストエディタ

### インストール

リポジトリをクローンして、ブラウザで `index.html` を開くだけです：

```bash
# リポジトリをクローン
git clone <repository-url>
cd nodejs-todo

# ブラウザで開く（方法 1: ダブルクリック）
open index.html

# または、簡易 HTTP サーバーで起動（方法 2: Python 3.x）
python3 -m http.server 8000

# ブラウザで http://localhost:8000 にアクセス
```

## 使用方法

### タスク作成

1. ページを開くと「TODOリスト」画面が表示されます
2. 「新規タスク作成」ボタンをクリック
3. タスク名（必須）と説明（オプション）を入力
4. 「保存」ボタンをクリック
5. 一覧ページに新規タスクが追加されます

### タスク表示

- タスク一覧で、タスク名をクリックするとタスク詳細画面が表示されます
- 詳細画面でタスク情報（名前、説明、作成日時、更新日時、ステータス）を確認できます

### タスク編集

1. タスク一覧または詳細画面の「編集」ボタンをクリック
2. 編集画面でタスク情報を変更
3. 「完了」チェックボックスで完了/未完了を切り替え
4. 「保存」ボタンをクリック

### タスク削除

- タスク一覧の「削除」ボタン、または編集画面の「削除」ボタンをクリック
- 確認ダイアログで「OK」をクリックするとタスクが削除されます

### データ永続化

- すべてのタスクはブラウザの LocalStorage に自動保存されます
- ブラウザを閉じても、ページをリロードしてもタスクが保持されます
- 別のタブやウィンドウでも同じデータにアクセスできます

## ファイル構成

```
index.html              # メイン HTML ファイル
css/
  └── style.css         # スタイルシート
js/
  ├── storage.js        # LocalStorage 管理モジュール
  ├── ui.js             # UI レンダリングモジュール
  └── app.js            # アプリケーションロジック + ルーティング
README.md              # このファイル
CONTRIBUTING.md        # 開発ガイド
```

## アーキテクチャ

### モジュール設計

**3 つの独立したモジュール**で構成：

1. **storage.js** - LocalStorage 管理
   - `getTasks()`: すべてのタスクを取得
   - `getTask(id)`: ID でタスクを取得
   - `saveTask(task)`: タスクを保存（新規作成・更新）
   - `deleteTask(id)`: タスクを削除

2. **ui.js** - UI レンダリング
   - `renderListPage(tasks)`: タスク一覧画面を生成
   - `renderCreatePage()`: タスク作成画面を生成
   - `renderDetailPage(task)`: タスク詳細画面を生成
   - `renderEditPage(task)`: タスク編集画面を生成

3. **app.js** - アプリケーションロジック
   - `navigate(page, taskId)`: ページ遷移
   - `render()`: 現在のページを描画
   - `handleCreateTask(event)`: タスク作成処理
   - `handleUpdateTask(event)`: タスク更新処理
   - `deleteTask(taskId)`: タスク削除処理

### ページ遷移（クライアント側ルーティング）

```
[一覧] ←→ [作成]
  ↓   ↘
[詳細] ←→ [編集]
```

## データモデル

### Task エンティティ

```javascript
{
  id: "1729580100000",              // タスク ID（Date.now()で自動生成）
  title: "買い物に行く",             // タスク名（1～100文字）
  description: "牛乳とパンを買う",   // 説明（0～500文字）
  completed: false,                 // 完了フラグ
  createdAt: "2025-10-22T09:00:00Z", // 作成日時（ISO 8601 形式）
  updatedAt: "2025-10-22T09:00:00Z"  // 更新日時（ISO 8601 形式）
}
```

## LocalStorage スキーマ

すべてのタスクは以下のキーで LocalStorage に保存されます：

```javascript
// Key: 'tasks'
// Value: JSON 配列
localStorage.setItem('tasks', JSON.stringify([
  { id, title, description, completed, createdAt, updatedAt },
  // ... その他のタスク
]));
```

## 動作確認

### ブラウザ DevTools で確認

```javascript
// ブラウザコンソール（F12）で実行

// すべてのタスク確認
console.log(storage.getTasks());

// 特定タスク確認（taskId を指定）
console.log(storage.getTask('1729580100000'));

// LocalStorage 直接確認
console.log(localStorage.getItem('tasks'));

// テストデータを追加
storage.saveTask({
  title: 'テストタスク',
  description: 'テスト用',
  completed: false
});

// 画面を再描画
render();
```

## パフォーマンス目標

| 項目 | 目標 | 実装値 |
|------|------|--------|
| タスク作成速度 | < 100ms | LocalStorage 同期 |
| 一覧読み込み速度（100タスク） | < 50ms | LocalStorage 読み込み |
| メモリ使用量（100タスク） | < 50KB | JSON 構造 |
| ページロード | < 500ms | ファイルベース |

## ブラウザ互換性

| ブラウザ | HTML5 | CSS3 | LocalStorage | ES6 |
|---------|-------|------|--------------|-----|
| Chrome | ✅ | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ | ✅ |
| Safari | ✅ | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ | ✅ |

**IE 11 は非対応**（ES6 が必須のため）

## セキュリティ考慮事項

### XSS（クロスサイトスクリプティング）対策

- ユーザー入力は HTML エスケープして表示（`ui.escapeHtml()`）
- `textContent` と `innerHTML` を適切に使い分け

### CSRF 対策

不要（同一オリジン、外部通信なし）

### データ検証

クライアント側バリデーションを実装：
- タスク名: 必須、1～100文字
- 説明: オプション、0～500文字

## 制限事項

- **単一ユーザー**: ログイン機能なし
- **オフラインのみ**: サーバー通信なし
- **容量制限**: LocalStorage 容量に依存（通常 5～10MB）
  - 約 10,000+ タスク対応可能
- **データ同期なし**: 複数ブラウザ間でのリアルタイム同期なし

## トラブルシューティング

### データが保存されない

**原因**: `file://` プロトコルでの実行

**解決**:
```bash
# HTTP サーバーを起動
python3 -m http.server 8000
# http://localhost:8000 でアクセス
```

### JavaScript エラー

**原因**: スクリプト読み込み順序が間違っている

**確認**:
```html
<!-- 正しい順序 -->
<script src="js/storage.js"></script>
<script src="js/ui.js"></script>
<script src="js/app.js"></script>
```

### LocalStorage がクリアされた

- ブラウザのキャッシュクリア時に削除される場合があります
- プライベートブラウジングモードではセッション終了時に削除されます

## 開発ガイド

詳細な開発ガイドは [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 憲法バージョン

このプロジェクトは **憲法 v2.0.0** に基づいて開発されています。

詳細は [.specify/memory/constitution.md](.specify/memory/constitution.md) を参照してください。

---

**最後に更新**: 2025-10-22

質問やフィードバックは GitHub Issues で報告してください。
