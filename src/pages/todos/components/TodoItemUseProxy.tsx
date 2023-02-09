import { actions, Todo } from '@/pages/todos/states/todo';
import React, { useState } from 'react';
import { useSnapshot } from 'umi';

export function TodoItemUseProxy({ todo: proxyTodo }: { todo: Todo }) {
  const todo = useSnapshot(proxyTodo);

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
