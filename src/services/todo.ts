
export async function queryTodos() {
  return fetch('/api/todos').then(res => res.json());
}

export async function addTodo({ text }: { text: string }) {
  return fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
    }),
  }).then(res => res.json());
}

export async function removeTodo({ id }: { id: number }) {
  return fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  }).then(res => res.json());
}

export async function updateTodo(id: number, props: object) {
  return fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...props,
    }),
  }).then(res => res.json());
}

export async function toggleAll(completed: boolean) {
  return fetch('/api/todos/toggleAll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      completed,
    }),
  }).then(res => res.json());
}
