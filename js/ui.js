// UI 操作・レンダリングモジュール

const ui = {
  // 一覧画面を描画
  renderListPage(tasks) {
    let html = '<div class="page-list">';
    html += '<h1>TODOリスト</h1>';
    html += '<button onclick="navigate(\'create\')" class="btn-primary">新規タスク作成</button>';

    if (tasks.length === 0) {
      html += '<div class="empty-state">タスクがありません</div>';
    } else {
      html += '<ul class="task-list">';
      tasks.forEach(task => {
        const completedClass = task.completed ? 'completed' : '';
        html += `
          <li class="task-item ${completedClass}" data-task-id="${task.id}">
            <span class="task-title" onclick="navigate('detail', '${task.id}')">${this.escapeHtml(task.title)}</span>
            <div class="task-actions">
              <button onclick="navigate('edit', '${task.id}')" class="btn-edit">編集</button>
              <button onclick="deleteTask('${task.id}')" class="btn-delete">削除</button>
            </div>
          </li>
        `;
      });
      html += '</ul>';
    }

    html += '</div>';
    return html;
  },

  // 作成画面を描画
  renderCreatePage() {
    return `
      <div class="page-create">
        <h1>新規タスク作成</h1>
        <div id="error-message" class="error-message"></div>
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
              oninput="updateCharCount('title')"
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
              oninput="updateCharCount('description')"
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
      </div>
    `;
  },

  // 詳細画面を描画
  renderDetailPage(task) {
    if (!task) {
      return '<div class="page-detail"><h1>タスクが見つかりません</h1><button onclick="navigate(\'list\')" class="btn-secondary">一覧へ戻る</button></div>';
    }

    const statusText = task.completed ? '完了' : '未完了';
    const statusClass = task.completed ? 'completed' : 'incomplete';
    const createdAt = this.formatDateTime(task.createdAt);
    const updatedAt = this.formatDateTime(task.updatedAt);

    return `
      <div class="page-detail">
        <h1>${this.escapeHtml(task.title)}</h1>

        <div class="task-info">
          <div class="info-item">
            <strong>説明:</strong>
            <p>${this.escapeHtml(task.description || '')}</p>
          </div>

          <div class="info-item">
            <strong>ステータス:</strong>
            <span class="status-badge ${statusClass}">${statusText}</span>
          </div>

          <div class="info-item">
            <strong>作成日時:</strong>
            <p>${createdAt}</p>
          </div>

          <div class="info-item">
            <strong>更新日時:</strong>
            <p>${updatedAt}</p>
          </div>
        </div>

        <div class="form-actions">
          <button onclick="navigate('edit', '${task.id}')" class="btn-primary">
            編集
          </button>
          <button onclick="navigate('list')" class="btn-secondary">
            一覧へ戻る
          </button>
        </div>
      </div>
    `;
  },

  // 編集画面を描画
  renderEditPage(task) {
    if (!task) {
      return '<div class="page-edit"><h1>タスクが見つかりません</h1><button onclick="navigate(\'list\')" class="btn-secondary">一覧へ戻る</button></div>';
    }

    return `
      <div class="page-edit">
        <h1>タスク編集</h1>
        <div id="edit-error" class="error-message"></div>
        <form id="edit-form" onsubmit="handleUpdateTask(event)">
          <div class="form-group">
            <label for="edit-title">タスク名 *</label>
            <input
              type="text"
              id="edit-title"
              name="title"
              value="${this.escapeHtml(task.title)}"
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
            >${this.escapeHtml(task.description || '')}</textarea>
          </div>

          <div class="form-group">
            <label for="edit-completed">
              <input type="checkbox" id="edit-completed" name="completed" ${task.completed ? 'checked' : ''}>
              完了
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">保存</button>
            <button type="button" onclick="deleteTask('${task.id}')" class="btn-danger">
              削除
            </button>
            <button type="button" onclick="navigate('detail', '${task.id}')" class="btn-secondary">
              キャンセル
            </button>
          </div>
        </form>
      </div>
    `;
  },

  // HTML エスケープ（XSS 対策）
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // 日時フォーマット
  formatDateTime(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
};
