// TodoList.jsx
// Renders the full list of todos + the form to add a new todo
// All CRUD state lives here

import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import TodoItem from "./TodoItem";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  function addTodo() {
    if (text.trim() === "") return;
    setTodos([...todos, { id: Date.now(), text, completed: false, subTodos: [] }]);
    setText("");
  }

  function deleteTodo(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  function toggleTodo(id) {
    setTodos(todos.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function editTodo(id, newText) {
    setTodos(todos.map((t) => t.id === id ? { ...t, text: newText } : t));
  }

  function addSubTodo(todoId, subText) {
    setTodos(todos.map((t) => t.id !== todoId ? t : {
      ...t,
      subTodos: [...t.subTodos, { id: Date.now(), text: subText, completed: false }],
    }));
  }

  function deleteSubTodo(todoId, subId) {
    setTodos(todos.map((t) => t.id !== todoId ? t : {
      ...t, subTodos: t.subTodos.filter((s) => s.id !== subId),
    }));
  }

  function toggleSubTodo(todoId, subId) {
    setTodos(todos.map((t) => t.id !== todoId ? t : {
      ...t,
      subTodos: t.subTodos.map((s) => s.id === subId ? { ...s, completed: !s.completed } : s),
    }));
  }

  function editSubTodo(todoId, subId, newText) {
    setTodos(todos.map((t) => t.id !== todoId ? t : {
      ...t,
      subTodos: t.subTodos.map((s) => s.id === subId ? { ...s, text: newText } : s),
    }));
  }

  return (
    <div>
      {/* Add new todo bar */}
      <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a new todo..." />
        <Button label="Add Todo" onClick={addTodo} />
      </div>

      {/* Todo cards */}
      <div>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={deleteTodo}
            onToggle={toggleTodo}
            onEdit={editTodo}
            onAddSub={addSubTodo}
            onDeleteSub={deleteSubTodo}
            onToggleSub={toggleSubTodo}
            onEditSub={editSubTodo}
          />
        ))}
      </div>
    </div>
  );
}

export default TodoList;