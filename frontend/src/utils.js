/** Data de hoje (fuso local) no formato YYYY-MM-DD. */
export function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Pendente + prazo já passou (comparação de strings ISO funciona para YYYY-MM-DD). */
export function isOverdue(task) {
  return !task.completed && !!task.due_date && task.due_date.slice(0, 10) < todayISO();
}

/** 'YYYY-MM-DD' -> '22/10/2026' */
export function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

/** O MySQL devolve completed como 0/1. */
export function normalizeTask(t) {
  return { ...t, completed: Boolean(t.completed) };
}
