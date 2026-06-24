// SubTodoList.jsx
import { useState } from "react";
import { Pencil, Trash2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import Input from "./Input";
import Button from "./Button";

function SubTodoList({ 
  subTodos, 
  onAdd, 
  onDelete, 
  onToggle, 
  onEdit,
  onAddNested,
  onDeleteNested,
  onToggleNested,
  onEditNested,
  level = 0
}) {
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [expandedItems, setExpandedItems] = useState({});
  const [showNestedInput, setShowNestedInput] = useState({});

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

  function toggleExpand(id) {
    setExpandedItems({
      ...expandedItems,
      [id]: !expandedItems[id]
    });
  }

  function toggleNestedInput(id) {
    setShowNestedInput({
      ...showNestedInput,
      [id]: !showNestedInput[id]
    });
  }

  const getLevelColor = (level) => {
    const colors = ['indigo', 'purple', 'pink', 'blue', 'green', 'orange', 'red', 'teal', 'cyan', 'rose'];
    return colors[level % colors.length];
  };

  const color = getLevelColor(level);
  const indentAmount = level * 16;

  return (
    <div 
      className="mt-3 space-y-2"
      style={{ marginLeft: `${indentAmount}px` }}
    >
      {/* Render existing subtasks */}
      {subTodos.map((sub) => {
        const hasChildren = sub.subTodos && sub.subTodos.length > 0;
        const isExpanded = expandedItems[sub.id];
        const showInput = showNestedInput[sub.id];
        const completedChildren = sub.subTodos?.filter(st => st.completed).length || 0;
        const totalChildren = sub.subTodos?.length || 0;

        return (
          <div key={sub.id} className="space-y-1">
            {/* Subtask Item */}
            <div 
              className={`flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 
                          border-l-4 transition-all duration-300 hover:shadow-sm
                          ${sub.completed ? 'opacity-60' : ''}`}
              style={{ borderColor: `var(--${color}-400)` }}
            >
              <input
                type="checkbox"
                checked={sub.completed}
                onChange={() => onToggle(sub.id)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />

              {editId === sub.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder="Edit subtask"
                    className="flex-1"
                  />
                  <Button label="Save" onClick={() => handleSaveEdit(sub.id)} variant="primary" />
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 text-sm font-medium ${
                      sub.completed ? "line-through text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {sub.text}
                  </span>
                  
                  {hasChildren && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {completedChildren}/{totalChildren}
                    </span>
                  )}

                  {hasChildren && (
                    <button
                      onClick={() => toggleExpand(sub.id)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  )}

                  {/* ADD SUB BUTTON - Opens nested input */}
                  <Button
                    label="Add Sub"
                    variant="ghost"
                    icon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => {
                      toggleNestedInput(sub.id);
                      // Expand to show children if there are any
                      if (hasChildren && !isExpanded) {
                        toggleExpand(sub.id);
                      }
                    }}
                  />

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

            {/* Nested Input - Shows when "Add Sub" is clicked */}
            {showInput && (
              <div 
                className="flex items-center gap-2 bg-indigo-50/50 rounded-xl border border-indigo-200 p-2 mt-1 ml-8"
                style={{ marginLeft: `${indentAmount + 16}px` }}
              >
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Add nested subtask...`}
                  className="flex-1 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && text.trim()) {
                      onAddNested(sub.id, text);
                      setText("");
                      setShowNestedInput({ ...showNestedInput, [sub.id]: false });
                    }
                  }}
                />
                <Button 
                  label="Add" 
                  onClick={() => {
                    if (text.trim()) {
                      onAddNested(sub.id, text);
                      setText("");
                      setShowNestedInput({ ...showNestedInput, [sub.id]: false });
                    }
                  }} 
                  variant="primary"
                  icon={<Plus className="w-3.5 h-3.5" />}
                />
                <button
                  onClick={() => setShowNestedInput({ ...showNestedInput, [sub.id]: false })}
                  className="text-gray-400 hover:text-gray-600 text-sm px-2"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Render children (RECURSIVE) */}
            {isExpanded && hasChildren && (
              <SubTodoList
                subTodos={sub.subTodos}
                onAdd={(text) => onAddNested(sub.id, text)}
                onDelete={(childId) => onDeleteNested(sub.id, childId)}
                onToggle={(childId) => onToggleNested(sub.id, childId)}
                onEdit={(childId, newText) => onEditNested(sub.id, childId, newText)}
                onAddNested={onAddNested}
                onDeleteNested={onDeleteNested}
                onToggleNested={onToggleNested}
                onEditNested={onEditNested}
                level={level + 1}
              />
            )}
          </div>
        );
      })}

      {/* Add new subtask input at current level */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 p-2 mt-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            level === 0 ? "Add a subtask..." : `Add level ${level + 1} subtask...`
          }
          className="flex-1 text-sm"
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button 
          label="Add" 
          onClick={handleAdd} 
          variant="primary"
          icon={<Plus className="w-3.5 h-3.5" />}
        />
      </div>
    </div>
  );
}

export default SubTodoList;