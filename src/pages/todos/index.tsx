import { useSnapshot } from 'umi';
import { actions, state, Todo, useFilteredTodos } from './states/todo';
import React, { useEffect, useState } from 'react';
import { TodoItemWithMemoAndPrimitiveProps } from './components/TodoItemWithMemoAndPrimitiveProps';
import { TodoItemUseProxy } from './components/TodoItemUseProxy';

function AddTodoInput() {
  const [v, setV] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (v.trim().length > 0) {
      setV('');
      actions.addTodo({ text: v.trim() });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Type to add Todo"
      />
    </form>
  );
}

function TodoList() {
  const todos = useFilteredTodos();
  const { loading } = useSnapshot(state);
  useEffect(() => {
    actions.fetchTodos().catch((e) => {});
  }, []);
  if (loading) return <div>loading...</div>;
  if (!todos.length) return null;
  return (
    <div>
      <ul>
        {todos.map((todo) => {
          return <SimpleTodoItem key={todo.id} todo={todo} />;
          // uncomment to try React.memo way optimized component
          // return <TodoItemWithMemoAndPrimitiveProps key={todo.id} {...todo} />;

          // uncomment to try useSnapshot way optimized component
          // return <TodoItemUseProxy key={todo.id} todo={state.todos.get(todo.id)!} />;
        })}
      </ul>
    </div>
  );
}

function SimpleTodoItem({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  function handleCheckBoxChange() {
    actions.toggleTodo(todo.id);
  }

  function handleDoubleClick() {
    if (todo.updating) {
      return;
    }
    setIsEditing(true);
  }

  function handleDelete() {
    actions.removeTodo(todo.id).catch((e) => {});
  }

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(todo.text);
    } else if (e.key === 'Enter' && editText.trim().length > 0) {
      setIsEditing(false);
      actions.updateTodo(todo.id, editText).catch((e) => {});
    }
  };
  return (
    <li>
      <div style={{ display: isEditing ? 'none' : 'block' }}>
        <input
          type="checkbox"
          checked={todo.completed}
          disabled={todo.updating}
          onChange={handleCheckBoxChange}
        />
        <span onDoubleClick={handleDoubleClick}>{todo.text}</span>
        <button onClick={handleDelete} disabled={todo.updating}>
          delete
        </button>
      </div>
      <div style={{ display: isEditing ? 'block' : 'none' }}>
        <input
          disabled={todo.updating}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeydown}
        />
      </div>
    </li>
  );
}

function Filter() {
  const { count, filter } = useSnapshot(state);
  if (!count.active && !count.completed) return null;
  return (
    <div>
      <span>{count.active}</span>
      <span>left</span>
      <button
        onClick={() => actions.toggleFilter('all')}
        style={filter === 'all' ? { color: 'red' } : {}}
      >
        All
      </button>
      <button
        onClick={() => actions.toggleFilter('todo')}
        style={filter === 'todo' ? { color: 'red' } : {}}
      >
        Todo
      </button>
      <button
        onClick={() => actions.toggleFilter('done')}
        style={filter === 'done' ? { color: 'red' } : {}}
      >
        Done
      </button>
    </div>
  );
}

export default () => {
  return (
    <div>
      <AddTodoInput />
      <TodoList />
      <Filter />
    </div>
  );
};
