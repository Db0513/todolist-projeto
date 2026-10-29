const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3333').replace(/\/$/, '');

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options,
  });

  // DELETE responde 204 sem corpo
  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* resposta sem JSON */
  }

  if (!res.ok) {
    throw new Error(data?.message || `Erro ${res.status} ao falar com o servidor.`);
  }
  return data;
}

/** GET /api/tasks?search=&status=all|pending|completed -> { tasks, total, completed } */
export function fetchTasks({ search = '', status = 'all', signal } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  return request(`/api/tasks?${params.toString()}`, { signal });
}

/** POST /api/tasks { title, dueDate? } */
export function createTask({ title, dueDate }) {
  return request('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, dueDate: dueDate || null }),
  });
}

/** PATCH /api/tasks/:id { completed?, title?, dueDate? } (dueDate: null remove o prazo) */
export function updateTask(id, changes) {
  return request(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });
}

/** DELETE /api/tasks/:id */
export function deleteTask(id) {
  return request(`/api/tasks/${id}`, { method: 'DELETE' });
}
