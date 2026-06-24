// TodoItem.jsx
import { useState } from "react";
import { Pencil, Trash2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import Input from "./Input";
import Button from "./Button";
import Badge from "./Badge";
import SubTodoList from "./SubTodoList";

function TodoItem({ 
  todo, 
  onDelete, 
  onToggle, 
  onEdit, 
  onAddSub, 
  onDeleteSub, 
  onToggleSub, 
  onEditSub,
  onAddNestedSub,
  onDeleteNestedSub,
  onToggleNestedSub,
  onEditNestedSub
}) {
  const [showSubs, setShowSubs] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  function handleSave() {
    onEdit(todo.id, editText);
    setIsEditing(false);
  }

  const totalSubs = todo.subTodos?.length || 0;
  const completedSubs = todo.subTodos?.filter(s => s.completed).length || 0;

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100
                  p-5 mb-4 transition-all duration-300
                  ${todo.completed ? "opacity-70" : ""}`}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5 accent-indigo-600 cursor-pointer"
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
              className={`flex-1 text-base font-medium ${
                todo.completed ? "line-through text-gray-400" : "text-gray-800"
              }`}
            >
              {todo.text}
            </span>

            {todo.completed && <Badge text="Done" />}
            
            {totalSubs > 0 && (
              <Badge text={`${completedSubs}/${totalSubs} subtasks`} />
            )}

            <Button
              label="Edit"
              variant="ghost"
              icon={<Pencil className="w-3.5 h-3.5" />}
              onClick={() => setIsEditing(true)}
            />
            <Button
              label="Delete"
              variant="danger"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => onDelete(todo.id)}
            />
          </>
        )}
      </div>

      {/* Subtask controls */}
      <div className="flex items-center gap-2 mt-3 pl-8 flex-wrap">
        {totalSubs > 0 && (
          <Button
            label={showSubs ? "Hide Subtasks" : `Show Subtasks (${totalSubs})`}
            variant="ghost"
            icon={showSubs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            onClick={() => setShowSubs(!showSubs)}
          />
        )}
        
        <Button
          label="+ Add Subtask"
          variant="primary"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setShowSubs(true)}
        />
      </div>

      {/* Subtask List */}
      {showSubs && (
        <SubTodoList
          subTodos={todo.subTodos}
          onAdd={(text) => onAddSub(todo.id, text)}
          onDelete={(subId) => onDeleteSub(todo.id, subId)}
          onToggle={(subId) => onToggleSub(todo.id, subId)}
          onEdit={(subId, newText) => onEditSub(todo.id, subId, newText)}
          onAddNested={(parentId, text) => onAddNestedSub(todo.id, parentId, text)}
          onDeleteNested={(parentId, subId) => onDeleteNestedSub(todo.id, parentId, subId)}
          onToggleNested={(parentId, subId) => onToggleNestedSub(todo.id, parentId, subId)}
          onEditNested={(parentId, subId, newText) => onEditNestedSub(todo.id, parentId, subId, newText)}
          level={0}
        />
      )}
    </div>
  );
}

export default TodoItem;