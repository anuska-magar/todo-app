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
    <div>
      {subTodos.map((sub) => (
        <div key={sub.id}>
          <input
            type="checkbox"
            checked={sub.completed}
            onChange={() => onToggle(sub.id)}
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
              <span>{sub.text}</span>
              <Button label="Edit" onClick={() => { setEditId(sub.id); setEditText(sub.text); }} />
              <Button label="Delete" onClick={() => onDelete(sub.id)} />
            </>
          )}
        </div>
      ))}

      {/* Add new subtodo */}
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a subtask..."
      />
      <Button label="Add Subtask" onClick={handleAdd} />
    </div>
  );
}

export default SubTodoList;