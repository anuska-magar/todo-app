// TodoList.jsx
// Renders the full list of todos + the form to add a new todo
// All CRUD state lives here

import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import Input from "./Input";
import Button from "./Button";
import TodoItem from "./TodoItem";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  function addTodo() {
    if (text.trim() === "") return;
    setTodos([...todos, { 
      id: Date.now(), 
      text, 
      completed: false, 
      subTodos: [] 
    }]);
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

  // ============ SUBTASK FUNCTIONS (Level 1) ============
  function addSubTodo(todoId, subText) {
    setTodos(todos.map((t) => t.id !== todoId ? t : {
      ...t,
      subTodos: [...t.subTodos, { 
        id: Date.now() + Math.random(), 
        text: subText, 
        completed: false,
        subTodos: [] 
      }],
    }));
  }

  function deleteSubTodo(todoId, subId) {
    setTodos(todos.map((t) => t.id !== todoId ? t : {
      ...t, 
      subTodos: t.subTodos.filter((s) => s.id !== subId),
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

  // ============ NESTED SUBTASK FUNCTIONS (Level 2+) ============
  function addNestedSubTodo(todoId, parentId, subText) {
    setTodos(todos.map((t) => {
      if (t.id !== todoId) return t;
      
      // Recursive function to find and add to parent
      const addToParent = (items) => {
        return items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              subTodos: [...(item.subTodos || []), {
                id: Date.now() + Math.random(),
                text: subText,
                completed: false,
                subTodos: []
              }]
            };
          }
          if (item.subTodos && item.subTodos.length > 0) {
            return {
              ...item,
              subTodos: addToParent(item.subTodos)
            };
          }
          return item;
        });
      };

      return {
        ...t,
        subTodos: addToParent(t.subTodos)
      };
    }));
  }

  function deleteNestedSubTodo(todoId, parentId, subId) {
    setTodos(todos.map((t) => {
      if (t.id !== todoId) return t;
      
      const deleteFromParent = (items) => {
        return items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              subTodos: (item.subTodos || []).filter((s) => s.id !== subId)
            };
          }
          if (item.subTodos && item.subTodos.length > 0) {
            return {
              ...item,
              subTodos: deleteFromParent(item.subTodos)
            };
          }
          return item;
        });
      };

      return {
        ...t,
        subTodos: deleteFromParent(t.subTodos)
      };
    }));
  }

  function toggleNestedSubTodo(todoId, parentId, subId) {
    setTodos(todos.map((t) => {
      if (t.id !== todoId) return t;
      
      const toggleInParent = (items) => {
        return items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              subTodos: (item.subTodos || []).map((s) => 
                s.id === subId ? { ...s, completed: !s.completed } : s
              )
            };
          }
          if (item.subTodos && item.subTodos.length > 0) {
            return {
              ...item,
              subTodos: toggleInParent(item.subTodos)
            };
          }
          return item;
        });
      };

      return {
        ...t,
        subTodos: toggleInParent(t.subTodos)
      };
    }));
  }

  function editNestedSubTodo(todoId, parentId, subId, newText) {
    setTodos(todos.map((t) => {
      if (t.id !== todoId) return t;
      
      const editInParent = (items) => {
        return items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              subTodos: (item.subTodos || []).map((s) => 
                s.id === subId ? { ...s, text: newText } : s
              )
            };
          }
          if (item.subTodos && item.subTodos.length > 0) {
            return {
              ...item,
              subTodos: editInParent(item.subTodos)
            };
          }
          return item;
        });
      };

      return {
        ...t,
        subTodos: editInParent(t.subTodos)
      };
    }));
  }

  return (
    <div>
      {/* Add new todo card */}
      <div className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
        <Input 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Add a new todo..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <Button label="Add Todo" onClick={addTodo} />
      </div>

      {/* Todo cards or empty state */}
      {todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 text-gray-400">
          <ClipboardCheck className="w-12 h-12 mb-3 text-indigo-300" />
          <p className="text-base font-medium text-gray-500">No todos yet</p>
          <p className="text-sm mt-1">Add your first task above to get started.</p>
        </div>
      ) : (
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
              onAddNestedSub={addNestedSubTodo}
              onDeleteNestedSub={deleteNestedSubTodo}
              onToggleNestedSub={toggleNestedSubTodo}
              onEditNestedSub={editNestedSubTodo}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoList;