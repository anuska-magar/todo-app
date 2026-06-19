// SubTodoList.jsx
// Renders the nested subtodos under a parent todo
// Supports add, edit, delete, and toggle complete for each subtodo

import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

function SubTodoList({ subTodos, onAdd, onDelete, onToggle, onEdit }) {
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  function handleAdd() {
    if (text.trim() === "") return;
    onAdd(text);
    setText("");
  }

  function handleSaveEdit(id) {
    onEdit(id, editText);
    setEditId(null);
    setEditText("");
  }

  return (
    <div className="mt-3 pl-6 border-l-2 border-indigo-100 space-y-2">
      {subTodos.map((sub) => (
        <div
          key={sub.id}
          className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
        >
          <input
            type="checkbox"
            checked={sub.completed}
            onChange={() => onToggle(sub.id)}
            className="w-4 h-4 accent-indigo-600"
          />

          {editId === sub.id ? (
            <>
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Edit subtodo"
              />
              <Button label="Save" onClick={() => handleSaveEdit(sub.id)} />
            </>
          ) : (
            <>
              <span
                className={`flex-1 text-sm ${
                  sub.completed ? "line-through text-gray-400" : "text-gray-700"
                }`}
              >
                {sub.text}
              </span>
              <Button
                label="Edit"
                onClick={() => {
                  setEditId(sub.id);
                  setEditText(sub.text);
                }}
              />
              <Button label="Delete" onClick={() => onDelete(sub.id)} />
            </>
          )}
        </div>
      ))}

      {/* Add new subtodo */}
      <div className="flex items-center gap-2 pt-1">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a subtask..."
        />
        <Button label="Add Subtask" onClick={handleAdd} />
      </div>
    </div>
  );
}

export default SubTodoList;