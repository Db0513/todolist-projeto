# on.time — Frontend (React + Vite)

Frontend da TodoList, consumindo o backend Fastify + MySQL (`/api/tasks`).

## Como rodar

1. Crie o banco: execute `schema.sql` no MySQL.
2. Suba o backend (porta padrão `3333`, CORS liberado para `http://localhost:5173`).
3. Neste projeto:

```bash
npm install
cp .env.example .env   # ajuste VITE_API_URL se o backend não estiver em localhost:3333
npm run dev            # abre em http://localhost:5173
```

> A porta do Vite está fixa em `5173` (`strictPort`) porque é a única origem liberada no CORS do backend.
> Se mudar a porta, ajuste `CORS_ORIGIN` no `.env` do backend.

## Funcionalidades

- Listagem com contadores de **total** e **concluídas** (vêm do próprio backend).
- **Create Task** / **Edit Task** em modal, com data limite opcional (editar com data vazia remove o prazo).
- Excluir (com confirmação) e marcar/desmarcar como concluída (checkbox com gradiente).
- Busca em tempo real com **debounce de 400 ms** (`src/hooks/useDebounce.js`); requisições antigas são canceladas (`AbortController`).
- Ordenação automática com data mais próxima primeiro — feita pelo backend (`ORDER BY (due_date IS NULL), due_date ASC`).
- **Em atraso**: pendente + prazo anterior a hoje → título vermelho e selo “Em atraso”.
- Botões de editar/excluir aparecem no hover (sempre visíveis em telas touch).
- Estado vazio “You have no pending tasks.” e botão flutuante “+”.

## Estrutura

```
src/
  api.js                 cliente HTTP (fetchTasks, createTask, updateTask, deleteTask)
  utils.js               datas, atraso, normalização
  hooks/useDebounce.js
  components/            TaskItem, TaskModal, Icons
  App.jsx                estado, busca, modais
  styles.css             tema roxo do mockup
```
