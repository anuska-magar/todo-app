import { useState } from "react";
import { Pencil, Trash2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import Input from "./Input";
import SubTodoList from "./SubTodoList";

function TodoItem({
  todo, onDelete, onToggle, onEdit,
  onAddSub, onDeleteSub, onToggleSub, onEditSub,
  onAddNestedSub, onDeleteNestedSub, onToggleNestedSub, onEditNestedSub
}) {
  const [showSubs, setShowSubs] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  function handleToggle() {
    if (!todo.completed) {
      // marking complete — hide subtasks
      setShowSubs(false);
    }
    onToggle(todo.id);
  }

  function handleSave() {
    onEdit(todo.id, editText);
    setIsEditing(false);
  }

  const totalSubs = todo.subTodos?.length || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3.5">
        <button
          onClick={handleToggle}
          className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            borderColor: todo.completed ? "#6b3f5e" : "#d4a8c4",
            backgroundColor: todo.completed ? "#6b3f5e" : "transparent"
          }}
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <Input value={editText} onChange={(e) => setEditText(e.target.value)} placeholder="Edit task" />
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-full text-xs text-white whitespace-nowrap"
              style={{ backgroundColor: "#6b3f5e" }}
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <span className={`flex-1 text-sm ${todo.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
              {todo.text}
            </span>

            <div className="flex items-center gap-1">
              {!todo.completed && (
                <button
                  onClick={() => setShowSubs(true)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-1.5 rounded-lg text-red-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {!todo.completed && totalSubs > 0 && (
                <button
                  onClick={() => setShowSubs(!showSubs)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showSubs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Subtasks — only shown when todo is NOT completed */}
      {showSubs && !todo.completed && (
        <div className="px-4 pb-3 border-t border-gray-100">
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
        </div>
      )}
    </div>
  );
}

export default TodoItem;