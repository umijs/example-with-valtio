import React, { useState } from 'react';
import { actions, Todo } from '@/pages/todos/states/todo';

export const TodoItemWithMemoAndPrimitiveProps = React.memo(
  ({ text, id, updating, completed }: Todo) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(text);

    function handleCheckBoxChange() {
      actions.toggleTodo(id);
    }

    function handleDoubleClick() {
      if (updating) {
        return;
      }
      setIsEditing(true);
    }

    function handleDelete() {
      actions.removeTodo(id).catch((e) => {});
    }

    const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      console.log(e.key);
      if (e.key === 'Escape') {
        setIsEditing(false);
        setEditText(text);
      } else if (e.key === 'Enter' && editText.trim().length > 0) {
        setIsEditing(false);
        actions.updateTodo(id, editText).catch((e) => {});
      }
    };
    return (
      <li>
        <div style={{ display: isEditing ? 'none' : 'block' }}>
          <input
            type="checkbox"
            checked={completed}
            disabled={updating}
            onChange={handleCheckBoxChange}
          />
          <span onDoubleClick={handleDoubleClick}>{text}</span>
          <button onClick={handleDelete} disabled={updating}>
            delete
          </button>
        </div>
        <div style={{ display: isEditing ? 'block' : 'none' }}>
          <input
            disabled={updating}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeydown}
          />
        </div>
      </li>
    );
  },
);
