import { useCallback, useEffect, useRef, useState } from 'react';
import { createTask, deleteTask, fetchTasks, updateTask } from './api.js';
import useDebounce from './hooks/useDebounce.js';
import { normalizeTask } from './utils.js';
import TaskItem from './components/TaskItem.jsx';
import TaskModal from './components/TaskModal.jsx';
import { PlusIcon, SearchIcon } from './components/Icons.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [totals, setTotals] = useState({ total: 0, completed: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // undefined = modal fechado | null = criar | objeto = editar
  const [modalTask, setModalTask] = useState(undefined);

  // A busca só dispara depois que o usuário para de digitar
  const debouncedSearch = useDebounce(search.trim(), 400);
  const abortRef = useRef(null);

  const load = useCallback(async () => {
    abortRef.current?.abort(); // descarta resposta de busca anterior ainda em andamento
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await fetchTasks({ search: debouncedSearch, signal: controller.signal });
      setTasks(data.tasks.map(normalizeTask));
      setTotals({ total: data.total, completed: data.completed });
      setError('');
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(
        err instanceof TypeError
          ? 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.'
          : err.message
      );
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  async function run(action) {
    try {
      await action();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const handleToggle = (task) => run(() => updateTask(task.id, { completed: !task.completed }));

  const handleDelete = (task) => {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) return;
    run(() => deleteTask(task.id));
  };

  async function handleSubmit({ title, dueDate }) {
    if (modalTask) {
      // dueDate '' => null remove o prazo (o backend trata "falsy" como null)
      await updateTask(modalTask.id, { title, dueDate: dueDate || null });
    } else {
      await createTask({ title, dueDate });
    }
    setModalTask(undefined);
    await load();
  }

  const closeModal = useCallback(() => setModalTask(undefined), []);
  const isSearching = debouncedSearch.length > 0;

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="logo">on.time</h1>
        <div className="counters" aria-live="polite">
          <span className="counter">
            <strong>{totals.total}</strong> total
          </span>
          <span className="counter">
            <strong>{totals.completed}</strong> concluídas
          </span>
        </div>
      </header>

      <div className="search">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search task"
          aria-label="Buscar tarefas"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="alert" role="alert">
          {error}
        </div>
      )}

      <main>
        {loading ? (
          <p className="state">Carregando…</p>
        ) : tasks.length === 0 ? (
          <div className="empty">
            <div className="empty__art" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="empty__title">
              {isSearching ? 'No tasks found.' : 'You have no pending tasks.'}
            </p>
          </div>
        ) : (
          <ul className="list">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={setModalTask}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </main>

      <button
        type="button"
        className="fab"
        aria-label="Create Task"
        onClick={() => setModalTask(null)}
      >
        <PlusIcon width={26} height={26} />
      </button>

      {modalTask !== undefined && (
        <TaskModal task={modalTask} onClose={closeModal} onSubmit={handleSubmit} />
      )}
    </div>
  );
}
