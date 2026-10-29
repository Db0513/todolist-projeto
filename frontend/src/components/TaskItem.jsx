import { CalendarIcon, CheckIcon, PencilIcon, TrashIcon } from './Icons.jsx';
import { formatDate, isOverdue } from '../utils.js';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task);

  const classes = ['task'];
  if (task.completed) classes.push('task--done');
  if (overdue) classes.push('task--overdue');

  return (
    <li className={classes.join(' ')}>
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
        className={`check ${task.completed ? 'check--on' : ''}`}
        onClick={() => onToggle(task)}
      >
        {task.completed && <CheckIcon />}
      </button>

      <div className="task__body">
        <span className="task__title">{task.title}</span>
        {task.due_date && (
          <span className="task__meta">
            <CalendarIcon />
            {formatDate(task.due_date)}
            {overdue && <span className="badge">Em atraso</span>}
          </span>
        )}
      </div>

      <div className="task__actions">
        <button
          type="button"
          className="icon-btn"
          aria-label={`Editar tarefa: ${task.title}`}
          onClick={() => onEdit(task)}
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          aria-label={`Excluir tarefa: ${task.title}`}
          onClick={() => onDelete(task)}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}
