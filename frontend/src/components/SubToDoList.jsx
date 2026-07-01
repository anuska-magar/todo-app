import { useState } from "react";
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp, ListChecks } from "lucide-react";
import Input from "./Input";

function SubTodoList({
  subTodos, onAdd, onDelete, onToggle, onEdit,
  onAddNested, onDeleteNested, onToggleNested, onEditNested,
  level = 0
}) {
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [expandedItems, setExpandedItems] = useState({});
  const [showInputFor, setShowInputFor] = useState({});

  function handleAdd() {
    if (text.trim() === "") return;
    onAdd(text);
    setText("");
  }

  function handleSaveEdit(id) {
    onEdit(id, editText);
    setEditId(null);
  }

  function toggleExpand(id) {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // Count direct children only
  function countDirectChildren(subTodos) {
    return subTodos ? subTodos.length : 0;
  }

  return (
    <div className="mt-2 space-y-1">
      {subTodos.map((sub) => {
        // Get children array
        const children = sub.subTodos || [];
        const hasChildren = children.length > 0;
        const isExpanded = expandedItems[sub.id] || false;
        const showInput = showInputFor[sub.id] || false;
        const childCount = countDirectChildren(children);

        return (
          <div key={sub.id}>
            <div className="flex items-start gap-2" style={{ paddingLeft: `${level * 20}px` }}>
              {/* Tree line */}
              <div className="flex flex-col items-center pt-1 flex-shrink-0" style={{ width: "20px" }}>
                <div className="w-px flex-1 bg-gray-300" style={{ minHeight: "20px" }} />
              </div>

              <div className="flex-1 flex items-center gap-2 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                {/* Circle checkbox */}
                <button
                  onClick={() => onToggle(sub.id)}
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    borderColor: sub.completed ? "#18181b" : "#d4d4d8",
                    backgroundColor: sub.completed ? "#18181b" : "transparent"
                  }}
                >
                  {sub.completed && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {editId === sub.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input value={editText} onChange={(e) => setEditText(e.target.value)} placeholder="Edit subtask" />
                    <button
                      onClick={() => handleSaveEdit(sub.id)}
                      className="px-3 py-1 rounded-full text-xs text-white whitespace-nowrap"
                      style={{ backgroundColor: "#18181b" }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <span className={`flex-1 text-sm ${sub.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                      {sub.text}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {/* BADGE: Shows count of children for THIS subtask */}
                      {!sub.completed && childCount > 0 && (
                        <button
                          onClick={() => toggleExpand(sub.id)}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium transition-colors"
                          style={{
                            backgroundColor: isExpanded ? "#d4d4d8" : "#e4e4e7",
                            color: "#18181b"
                          }}
                        >
                          <ListChecks className="w-3 h-3" />
                          <span>{childCount}</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => setShowInputFor((prev) => ({ ...prev, [sub.id]: !prev[sub.id] }))}
                        className="p-1 text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setEditId(sub.id); setEditText(sub.text); }}
                        className="p-1 text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(sub.id)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {hasChildren && (
                        <button
                          onClick={() => toggleExpand(sub.id)}
                          className="p-1 text-gray-500 hover:text-gray-800 transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Input for adding nested subtask */}
            {showInput && (
              <div className="flex items-center gap-2 mt-1 rounded-xl bg-gray-100 px-3 py-2"
                style={{ marginLeft: `${(level + 1) * 20 + 20}px` }}>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Add nested subtask..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && text.trim()) {
                      onAddNested(sub.id, text);
                      setText("");
                      setShowInputFor((prev) => ({ ...prev, [sub.id]: false }));
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (text.trim()) {
                      onAddNested(sub.id, text);
                      setText("");
                      setShowInputFor((prev) => ({ ...prev, [sub.id]: false }));
                    }
                  }}
                  className="px-3 py-1.5 rounded-full text-xs text-white whitespace-nowrap"
                  style={{ backgroundColor: "#18181b" }}
                >
                  Add
                </button>
                <button
                  onClick={() => setShowInputFor((prev) => ({ ...prev, [sub.id]: false }))}
                  className="text-xs text-gray-600 hover:text-gray-800 whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Recursive children - passes children to next level */}
            {isExpanded && hasChildren && (
              <SubTodoList
                subTodos={children}
                onAdd={(t) => onAddNested(sub.id, t)}
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

      {/* Add subtask input at current level */}
      <div className="flex items-center gap-2 mt-2 rounded-xl bg-gray-100 px-3 py-2"
        style={{ marginLeft: `${level * 20 + 20}px` }}>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={level === 0 ? "Add a subtask..." : "Add nested subtask..."}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 rounded-full text-xs text-white whitespace-nowrap"
          style={{ backgroundColor: "#18181b" }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default SubTodoList;