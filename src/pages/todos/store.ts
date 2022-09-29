import { useSnapshot, proxyMap, proxyWithComputed } from 'umi';
import {
  addTodo,
  removeTodo,
  queryTodos,
  updateTodo,
  toggleAll,
} from './service';

export interface Todo {
  id: number;
  text: string;
  completed?: boolean;
}

type Filter = 'all' | 'todo' | 'done';

export const store = proxyWithComputed(
  {
    todos: proxyMap<number, Todo>(),
    filter: 'all',
    loading: false,
  },
  {
    count: (snap) => {
      let count = { active: 0, completed: 0 };
      snap.todos.forEach((todo) => {
        if (todo.completed) count.completed += 1;
        else count.active += 1;
      });
      return count;
    },
  },
);

export const actions = {
  async addTodo(todo: Omit<Todo, 'id'>) {
    await addTodo({ text: todo.text });
    await this.fetchTodos();
  },
  async toggleTodo(id: number) {
    const todo = store.todos.get(id);
    if (todo) {
      await updateTodo(id, { completed: !todo.completed });
      await this.fetchTodos();
    }
  },
  async toggleAll(completed: boolean) {
    await toggleAll(completed);
    await this.fetchTodos();
  },
  async removeTodo(id: number) {
    await removeTodo({ id });
    await this.fetchTodos();
  },
  toggleFilter(filter: Filter) {
    store.filter = filter;
  },
  async updateTodo(id: number, text: string) {
    await updateTodo(id, { text });
    await this.fetchTodos();
  },
  async fetchTodos() {
    store.loading = true;
    const todos = await queryTodos();
    store.todos = proxyMap<number, Todo>(todos);
    store.loading = false;
  },
};

export function useTodos() {
  const snapshot = useSnapshot(store);

  switch (snapshot.filter) {
    case 'all':
      return Array.from(snapshot.todos.values());
    case 'done':
      return Array.from(snapshot.todos.values()).filter(
        (todo) => todo.completed,
      );
    case 'todo':
      return Array.from(snapshot.todos.values()).filter(
        (todo) => !todo.completed,
      );
    default:
      throw Error('Error: un supported filter');
  }
}
