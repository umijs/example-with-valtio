import { useSnapshot, proxyMap, proxyWithComputed } from 'umi';
import {
  addTodo,
  removeTodo,
  queryTodos,
  updateTodo,
  toggleAll,
} from '@/services/todo';

export interface Todo {
  id: number;
  text: string;
  completed?: boolean;
  updating?: boolean;
}

type Filter = 'all' | 'todo' | 'done';

export const state = proxyWithComputed(
  {
    todos: proxyMap<number, Todo>(),
    filter: 'all',
    loading: false,
  },
  {
    filteredTodoList: (snap) => {
      switch (snap.filter) {
        case 'all':
          return Array.from(snap.todos.values());
        case 'done':
          return Array.from(snap.todos.values()).filter(
            (todo) => todo.completed,
          );
        case 'todo':
          return Array.from(snap.todos.values()).filter(
            (todo) => !todo.completed,
          );
        default:
          throw Error('Error: un supported filter');
      }
    },

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
    await this.fetchTodos(true);
  },
  async toggleTodo(id: number) {
    const todo = state.todos.get(id);
    if (todo) {
      todo.updating = true;
      const willCompleted = !todo.completed;
      todo.completed = willCompleted;
      await updateTodo(id, { completed: willCompleted });
      todo.updating = false;
      // await this.fetchTodos(true);
    }
  },
  async toggleAll(completed: boolean) {
    await toggleAll(completed);
    await this.fetchTodos();
  },
  async removeTodo(id: number) {
    await removeTodo({ id });
    await this.fetchTodos(true);
  },
  toggleFilter(filter: Filter) {
    state.filter = filter;
  },
  async updateTodo(id: number, text: string) {
    await updateTodo(id, { text });
    await this.fetchTodos(true);
  },
  async fetchTodos(silent = false) {
    if (!silent) {
      state.loading = true;
    }
    const todos = await queryTodos();
    state.todos = proxyMap<number, Todo>(todos);
    if (!silent) {
      state.loading = false;
    }
  },
};

export function useFilteredTodos() {
  const { filteredTodoList } = useSnapshot(state);
  return filteredTodoList;
}

export const useTodoApp = () => useSnapshot(state);
