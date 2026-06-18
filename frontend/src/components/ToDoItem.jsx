// TodoItem.jsx
// A single todo row with edit, delete, toggle complete
// Also shows/hides its nested SubTodoList

import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import Badge from "./Badge";
import SubTodoList from "./SubTodoList";

function TodoItem({ todo, onDelete, onToggle, onEdit, onAddSub, onDeleteSub, onToggleSub, onEditSub }) {
  const [showSubs, setShowSubs] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  function handleSave() {
    onEdit(todo.id, editText);
    setIsEditing(false);
  }

  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {isEditing ? (
        <>
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Edit todo"
          />
          <Button label="Save" onClick={handleSave} />
        </>
      ) : (
        <>
          <span>{todo.text}</span>
          <Button label="Edit" onClick={() => setIsEditing(true)} />
          <Button label="Delete" onClick={() => onDelete(todo.id)} />
        </>
      )}

      {todo.subTodos.length > 0 && (
        <Badge text={`${todo.subTodos.length} subtask(s)`} />
      )}

      <Button
        label={showSubs ? "Hide Subtasks" : "Show Subtasks"}
        onClick={() => setShowSubs(!showSubs)}
      />

      {showSubs && (
        <SubTodoList
          subTodos={todo.subTodos}
          onAdd={(text) => onAddSub(todo.id, text)}
          onDelete={(subId) => onDeleteSub(todo.id, subId)}
          onToggle={(subId) => onToggleSub(todo.id, subId)}
          onEdit={(subId, newText) => onEditSub(todo.id, subId, newText)}
        />
      )}
    </div>
  );
}

export default TodoItem;