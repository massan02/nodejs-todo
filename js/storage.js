// LocalStorage を使用したデータ管理モジュール

const storage = {
  // すべてのタスクを取得
  getTasks() {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
  },

  // ID で単一のタスクを取得
  getTask(id) {
    const tasks = this.getTasks();
    return tasks.find(t => t.id === id);
  },

  // タスクを保存（新規作成時と更新時の両方に対応）
  saveTask(task) {
    const tasks = this.getTasks();
    const exists = tasks.find(t => t.id === task.id);

    if (exists) {
      // 既存タスクを更新
      Object.assign(exists, task);
    } else {
      // 新規タスクを追加
      tasks.push({
        id: Date.now().toString(),
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
  },

  // タスクを削除
  deleteTask(id) {
    const tasks = this.getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(filtered));
  }
};
