// frontend/src/components/TodoList.jsx
import { useState, useEffect } from "react";
import { ClipboardCheck } from "lucide-react";
import Input from "./Input";
import Button from "./Button";
import TodoItem from "./TodoItem";
import { getCurrentUser } from "../utils/auth";
import { 
  getUserTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  toggleTask,
  addSubtask 
} from "../appwrite/tasks";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  // Load user and tasks on mount
  useEffect(() => {
    loadUserAndTasks();
  }, []);

  const loadUserAndTasks = async () => {
    try {
      setLoading(true);
      // Get current user
      const user = await getCurrentUser();
      if (user) {
        setUserId(user.$id);
        // Load tasks for this user
        const result = await getUserTasks(user.$id);
        if (result.success) {
          setTodos(result.data);
        } else {
          setError("Failed to load tasks");
        }
      }
    } catch (err) {
      setError("Error loading tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (text.trim() === "") return;
    
    setLoading(true);
    const result = await createTask({
      taskName: text,
      userId: userId,
      priority: "medium",
      description: ""
    });

    if (result.success) {
      // Reload tasks to get updated list
      const tasksResult = await getUserTasks(userId);
      if (tasksResult.success) {
        setTodos(tasksResult.data);
      }
      setText("");
    } else {
      setError("Failed to add task");
    }
    setLoading(false);
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    setLoading(true);
    const result = await deleteTask(id);
    if (result.success) {
      // Remove from local state
      setTodos(todos.filter((t) => t.id !== id));
    } else {
      setError("Failed to delete task");
    }
    setLoading(false);
  };

  // Toggle todo completion
  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    setLoading(true);
    const result = await toggleTask(id, !todo.completed);
    if (result.success) {
      // Update local state
      setTodos(todos.map((t) => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } else {
      setError("Failed to update task");
    }
    setLoading(false);
  };

  // Edit todo
  const editTodo = async (id, newText) => {
    setLoading(true);
    const result = await updateTask(id, { taskName: newText });
    if (result.success) {
      setTodos(todos.map((t) => 
        t.id === id ? { ...t, text: newText } : t
      ));
    } else {
      setError("Failed to update task");
    }
    setLoading(false);
  };

  // ============ SUBTASK FUNCTIONS ============
  
  // Add subtask to a todo
  const addSubTodo = async (todoId, subText) => {
    setLoading(true);
    const result = await addSubtask(todoId, subText, userId);
    if (result.success) {
      // Reload tasks to get updated structure
      const tasksResult = await getUserTasks(userId);
      if (tasksResult.success) {
        setTodos(tasksResult.data);
      }
    } else {
      setError("Failed to add subtask");
    }
    setLoading(false);
  };

  // Delete subtask
  const deleteSubTodo = async (todoId, subId) => {
    setLoading(true);
    const result = await deleteTask(subId);
    if (result.success) {
      // Update local state
      setTodos(todos.map((t) => {
        if (t.id === todoId) {
          return {
            ...t,
            subTodos: t.subTodos.filter((s) => s.id !== subId)
          };
        }
        return t;
      }));
    } else {
      setError("Failed to delete subtask");
    }
    setLoading(false);
  };

  // Toggle subtask completion
  const toggleSubTodo = async (todoId, subId) => {
    const todo = todos.find(t => t.id === todoId);
    const subtask = todo?.subTodos.find(s => s.id === subId);
    if (!subtask) return;

    setLoading(true);
    const result = await toggleTask(subId, !subtask.completed);
    if (result.success) {
      setTodos(todos.map((t) => {
        if (t.id === todoId) {
          return {
            ...t,
            subTodos: t.subTodos.map((s) =>
              s.id === subId ? { ...s, completed: !s.completed } : s
            )
          };
        }
        return t;
      }));
    } else {
      setError("Failed to update subtask");
    }
    setLoading(false);
  };

  // Edit subtask
  const editSubTodo = async (todoId, subId, newText) => {
    setLoading(true);
    const result = await updateTask(subId, { taskName: newText });
    if (result.success) {
      setTodos(todos.map((t) => {
        if (t.id === todoId) {
          return {
            ...t,
            subTodos: t.subTodos.map((s) =>
              s.id === subId ? { ...s, text: newText } : s
            )
          };
        }
        return t;
      }));
    } else {
      setError("Failed to update subtask");
    }
    setLoading(false);
  };

  // ============ NESTED SUBTASK FUNCTIONS ============
  
  // Add nested subtask
  const addNestedSubTodo = async (todoId, parentId, subText) => {
    setLoading(true);
    const result = await addSubtask(parentId, subText, userId);
    if (result.success) {
      // Reload tasks to get updated structure
      const tasksResult = await getUserTasks(userId);
      if (tasksResult.success) {
        setTodos(tasksResult.data);
      }
    } else {
      setError("Failed to add nested subtask");
    }
    setLoading(false);
  };

  // Delete nested subtask
  const deleteNestedSubTodo = async (todoId, parentId, subId) => {
    setLoading(true);
    const result = await deleteTask(subId);
    if (result.success) {
      // Reload tasks to get updated structure
      const tasksResult = await getUserTasks(userId);
      if (tasksResult.success) {
        setTodos(tasksResult.data);
      }
    } else {
      setError("Failed to delete nested subtask");
    }
    setLoading(false);
  };

  // Toggle nested subtask
  const toggleNestedSubTodo = async (todoId, parentId, subId) => {
    // Find the subtask in the nested structure
    let subtask = null;
    const findSubtask = (items) => {
      for (const item of items) {
        if (item.id === subId) {
          subtask = item;
          return true;
        }
        if (item.subTodos && item.subTodos.length > 0) {
          if (findSubtask(item.subTodos)) return true;
        }
      }
      return false;
    };
    
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      findSubtask(todo.subTodos);
    }
    if (!subtask) return;

    setLoading(true);
    const result = await toggleTask(subId, !subtask.completed);
    if (result.success) {
      // Reload tasks to get updated structure
      const tasksResult = await getUserTasks(userId);
      if (tasksResult.success) {
        setTodos(tasksResult.data);
      }
    } else {
      setError("Failed to update nested subtask");
    }
    setLoading(false);
  };

  // Edit nested subtask
  const editNestedSubTodo = async (todoId, parentId, subId, newText) => {
    setLoading(true);
    const result = await updateTask(subId, { taskName: newText });
    if (result.success) {
      // Reload tasks to get updated structure
      const tasksResult = await getUserTasks(userId);
      if (tasksResult.success) {
        setTodos(tasksResult.data);
      }
    } else {
      setError("Failed to update nested subtask");
    }
    setLoading(false);
  };

  if (loading && todos.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
        {error}
      </div>
    );
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
          disabled={loading}
        />
        <Button 
          label="Add Todo" 
          onClick={addTodo} 
          disabled={loading}
        />
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