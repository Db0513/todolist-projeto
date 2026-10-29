import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './Icons.jsx';

/**
 * Modal reutilizado para "Create Task" (task = null) e "Edit Task" (task = objeto).
 * onSubmit recebe { title, dueDate } — dueDate é '' quando não há prazo.
 */
export default function TaskModal({ task, onClose, onSubmit }) {
  const isEdit = Boolean(task);
  const [title, setTitle] = useState(task?.title ?? '');
  const [dueDate, setDueDate] = useState(task?.due_date?.slice(0, 10) ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('O nome da tarefa é obrigatório.');
      inputRef.current?.focus();
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ title: title.trim(), dueDate });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onSubmit={handleSubmit}
        noValidate
      >
        <header className="modal__header">
          <h2 id="modal-title">{isEdit ? 'Edit Task' : 'Create Task'}</h2>
          <button type="button" className="icon-btn" aria-label="Fechar" onClick={onClose}>
            <CloseIcon />
          </button>
        </header>

        <label className="field">
          <span>Task name</span>
          <input
            ref={inputRef}
            type="text"
            value={title}
            maxLength={255}
            placeholder="O que precisa ser feito?"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="field">
          <span>
            Due date <em>(opcional)</em>
          </span>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <footer className="modal__footer">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save' : 'Create'}
          </button>
        </footer>
      </form>
    </div>
  );
}
