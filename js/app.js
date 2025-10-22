// アプリケーションロジック + 初期化

// グローバル状態管理
let currentPage = 'list';
let currentTaskId = null;

// ページ遷移関数
function navigate(page, taskId = null) {
  currentPage = page;
  currentTaskId = taskId;
  render();
  window.scrollTo(0, 0);
}

// 画面をレンダリング
function render() {
  const tasks = storage.getTasks();
  let html = '';

  if (currentPage === 'list') {
    html = ui.renderListPage(tasks);
  } else if (currentPage === 'create') {
    html = ui.renderCreatePage();
  } else if (currentPage === 'detail') {
    const task = storage.getTask(currentTaskId);
    html = ui.renderDetailPage(task);
  } else if (currentPage === 'edit') {
    const task = storage.getTask(currentTaskId);
    html = ui.renderEditPage(task);
  }

  document.getElementById('app').innerHTML = html;
}

// タスク作成処理
function handleCreateTask(event) {
  event.preventDefault();

  const title = document.getElementById('input-title').value.trim();
  const description = document.getElementById('input-description').value.trim();
  const errorDiv = document.getElementById('error-message');

  // バリデーション
  if (!title) {
    errorDiv.textContent = 'タスク名は必須です';
    errorDiv.style.display = 'block';
    return;
  }

  if (title.length > 100) {
    errorDiv.textContent = 'タスク名は100文字以下にしてください';
    errorDiv.style.display = 'block';
    return;
  }

  if (description.length > 500) {
    errorDiv.textContent = '説明は500文字以下にしてください';
    errorDiv.style.display = 'block';
    return;
  }

  // タスクを保存
  storage.saveTask({
    title,
    description,
    completed: false
  });

  navigate('list');
}

// タスク更新処理
function handleUpdateTask(event) {
  event.preventDefault();

  const title = document.getElementById('edit-title').value.trim();
  const description = document.getElementById('edit-description').value.trim();
  const completed = document.getElementById('edit-completed').checked;
  const errorDiv = document.getElementById('edit-error');

  // バリデーション
  if (!title) {
    errorDiv.textContent = 'タスク名は必須です';
    errorDiv.style.display = 'block';
    return;
  }

  if (title.length > 100) {
    errorDiv.textContent = 'タスク名は100文字以下にしてください';
    errorDiv.style.display = 'block';
    return;
  }

  if (description.length > 500) {
    errorDiv.textContent = '説明は500文字以下にしてください';
    errorDiv.style.display = 'block';
    return;
  }

  // タスクを更新
  const task = storage.getTask(currentTaskId);
  if (task) {
    task.title = title;
    task.description = description;
    task.completed = completed;
    task.updatedAt = new Date().toISOString();
    storage.saveTask(task);
  }

  navigate('detail', currentTaskId);
}

// タスク削除処理
function deleteTask(taskId) {
  if (confirm('このタスクを削除しますか？')) {
    storage.deleteTask(taskId);
    navigate('list');
  }
}

// 文字数カウント更新
function updateCharCount(field) {
  let inputId, countId, maxLength;

  if (field === 'title') {
    inputId = 'input-title';
    countId = 'title-count';
    maxLength = 100;
  } else if (field === 'description') {
    inputId = 'input-description';
    countId = 'description-count';
    maxLength = 500;
  }

  const input = document.getElementById(inputId);
  const count = document.getElementById(countId);

  if (input && count) {
    count.textContent = `${input.value.length}/${maxLength}`;
  }
}

// アプリケーション初期化
window.addEventListener('load', () => {
  render();
});
