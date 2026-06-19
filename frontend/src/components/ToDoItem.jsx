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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3">
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5 accent-indigo-600"
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
            <span
              className={`flex-1 text-sm font-medium ${
                todo.completed ? "line-through text-gray-400" : "text-gray-800"
              }`}
            >
              {todo.text}
            </span>

            {todo.completed && <Badge text="Done" />}

            <Button label="Edit" onClick={() => setIsEditing(true)} />
            <Button label="Delete" onClick={() => onDelete(todo.id)} />
          </>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2 pl-8">
        {todo.subTodos.length > 0 && (
          <Badge text={`${todo.subTodos.length} subtask(s)`} />
        )}

        <Button
          label={showSubs ? "Hide Subtasks" : "Show Subtasks"}
          onClick={() => setShowSubs(!showSubs)}
        />
      </div>

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