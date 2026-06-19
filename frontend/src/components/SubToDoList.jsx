// SubTodoList.jsx
// Renders the nested subtodos under a parent todo
// Supports add, edit, delete, and toggle complete for each subtodo

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
    <div className="mt-4 ml-4 pl-5 border-l-2 border-indigo-200 space-y-3">
      {subTodos.map((sub) => (
        <div
          key={sub.id}
          className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 transition-colors duration-300 hover:bg-indigo-50/50"
        >
          <input
            type="checkbox"
            checked={sub.completed}
            onChange={() => onToggle(sub.id)}
            className="w-4 h-4 accent-indigo-600 cursor-pointer"
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
                  sub.completed ? "line-through text-gray-400 opacity-70" : "text-gray-700"
                }`}
              >
                {sub.text}
              </span>
              <Button
                label="Edit"
                variant="ghost"
                icon={<Pencil className="w-3.5 h-3.5" />}
                onClick={() => {
                  setEditId(sub.id);
                  setEditText(sub.text);
                }}
              />
              <Button
                label="Delete"
                variant="danger"
                icon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => onDelete(sub.id)}
              />
            </>
          )}
        </div>
      ))}

      {/* Add new subtodo — small card section */}
      <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 p-2.5 mt-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a subtask..."
        />
        <Button label="Add" onClick={handleAdd} />
      </div>
    </div>
  );
}

export default SubTodoList;