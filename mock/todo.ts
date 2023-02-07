import { Todo } from '../pages/todo/store';
import { defineMock } from 'umi';

let id = 0;
let todos = new Map<number, Todo>([
  [999, { id: 999, text: 'Learn Umi', completed: false }],
  [998, { id: 998, text: 'Learn Bigfish', completed: false }],
]);

export default defineMock({
  'GET /api/todos': (req, res) => {
    setTimeout(() => {
      res.json(Array.from(todos.entries()));
    }, 1000);
  },

  'POST /api/todos': (req, res) => {
    const text = req.body.text;
    let nextId = id++;
    todos.set(nextId, { id: nextId, text, completed: false });
    res.json({ success: true, todos: Array.from(todos.entries()) });
  },

  'POST /api/todos/toggleAll': (req, res) => {
    const completed = req.body.completed;
    todos.forEach((todo) => {
      todo.completed = completed;
    });
    res.json({ success: true, todos: Array.from(todos.entries()) });
  },

  'PUT /api/todos/:id': (req, res) => {
    const id = parseInt(req.params.id, 10);
    const todo = todos.get(id);
    if (todo) {
      Object.assign(todo, req.body);
      const randomDelay = 500 + Math.floor(Math.random() * 2000);
      setTimeout(() => {
        res.json({ success: true, todo });
      }, randomDelay);
    } else {
      res.status(404);
      res.end();
    }
  },

  'DELETE /api/todos/:id': (req, res) => {
    const id = parseInt(req.params.id, 10);
    const todo = todos.get(id);
    if (todo) {
      todos.delete(id);
      res.json({ success: true });
    } else {
      res.status(404);
      res.end();
    }
  },
});
