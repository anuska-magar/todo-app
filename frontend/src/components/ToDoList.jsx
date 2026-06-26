<<<<<<< HEAD
// frontend/src/components/TodoList.jsx
import { useState, useEffect } from "react";
import { ClipboardCheck } from "lucide-react";
=======
import { useState, useEffect } from "react";
import { ClipboardCheck, Loader2 } from "lucide-react";
>>>>>>> dca63fa90a93c623f6774ad115ce60def8f4da71
import Input from "./Input";
import TodoItem from "./TodoItem";
import { getCurrentUser } from "../utils/auth";
<<<<<<< HEAD
import { 
  getUserTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  toggleTask,
  addSubtask 
} from "../appwrite/tasks";
=======
import { createTask, getUserTasks, updateTask, deleteTask } from "../appwrite/tasks";
>>>>>>> dca63fa90a93c623f6774ad115ce60def8f4da71

function TodoList({ onCountChange }) {
  const [todos, setTodos] = useState([]); // flat list, each: { $id, taskName, is_completed, parentId, userId, ... }
  const [text, setText] = useState("");
<<<<<<< HEAD
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
=======
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Load current user, then their tasks ---
  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.$id);
      try {
        const res = await getUserTasks(user.$id);
        setTodos(res.documents);
      } catch (err) {
        console.error(err);
        setError("Couldn't load your tasks. Please refresh.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // --- Report counts up to parent (Header stats) ---
  useEffect(() => {
    if (onCountChange) {
      onCountChange(todos.length, todos.filter((t) => t.is_completed).length);
    }
  }, [todos, onCountChange]);

  // --- Tree helpers (derive nesting from flat parentId list) ---
  function getChildren(parentId) {
    return todos.filter((t) => t.parentId === parentId);
  }

  function getAllDescendantIds(taskId) {
    const direct = todos.filter((t) => t.parentId === taskId);
    let ids = direct.map((t) => t.$id);
    for (const child of direct) {
      ids = ids.concat(getAllDescendantIds(child.$id));
    }
    return ids;
  }

  // --- Add a top-level task ---
  async function addTodo() {
    if (text.trim() === "" || !userId) return;
    const taskName = text.trim();
    setText("");

    // Optimistic temp entry
    const tempId = `temp-${Date.now()}`;
    const tempTask = {
      $id: tempId,
      taskName,
      is_completed: false,
      userId,
      parentId: "",
      priority: "medium",
      description: "",
    };
    setTodos((prev) => [...prev, tempTask]);

    try {
      const created = await createTask({ taskName, userId, parentId: "" });
      setTodos((prev) => prev.map((t) => (t.$id === tempId ? created : t)));
    } catch (err) {
      console.error(err);
      setTodos((prev) => prev.filter((t) => t.$id !== tempId));
      setError("Couldn't add task. Please try again.");
    }
  }

  // --- Add a sub-task under any parent (works at any depth) ---
  async function addSubTodo(parentId, subText) {
    if (subText.trim() === "" || !userId) return;
    const taskName = subText.trim();

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempTask = {
      $id: tempId,
      taskName,
      is_completed: false,
      userId,
      parentId,
      priority: "medium",
      description: "",
    };
    setTodos((prev) => [...prev, tempTask]);

    try {
      const created = await createTask({ taskName, userId, parentId });
      setTodos((prev) => prev.map((t) => (t.$id === tempId ? created : t)));
    } catch (err) {
      console.error(err);
      setTodos((prev) => prev.filter((t) => t.$id !== tempId));
      setError("Couldn't add sub-task. Please try again.");
    }
  }

  // --- Toggle complete, cascading to all descendants ---
  async function toggleTodo(id) {
    const target = todos.find((t) => t.$id === id);
    if (!target) return;
    const newCompleted = !target.is_completed;
    const descendantIds = newCompleted ? getAllDescendantIds(id) : [];
    const affectedIds = [id, ...descendantIds];

    // Optimistic update
    const previousTodos = todos;
    setTodos((prev) =>
      prev.map((t) => (affectedIds.includes(t.$id) ? { ...t, is_completed: newCompleted } : t))
    );

    try {
      await Promise.all(
        affectedIds.map((taskId) => updateTask(taskId, { is_completed: newCompleted }))
      );
    } catch (err) {
      console.error(err);
      setTodos(previousTodos); // rollback
      setError("Couldn't update task. Please try again.");
    }
  }

  // --- Edit task text ---
  async function editTodo(id, newText) {
    const trimmed = newText.trim();
    if (!trimmed) return;
    const previousTodos = todos;
    setTodos((prev) => prev.map((t) => (t.$id === id ? { ...t, taskName: trimmed } : t)));

    try {
      await updateTask(id, { taskName: trimmed });
    } catch (err) {
      console.error(err);
      setTodos(previousTodos);
      setError("Couldn't save changes. Please try again.");
    }
  }

  // --- Delete task + cascade delete all descendants ---
  async function deleteTodo(id) {
    const descendantIds = getAllDescendantIds(id);
    const idsToDelete = [id, ...descendantIds];

    const previousTodos = todos;
    setTodos((prev) => prev.filter((t) => !idsToDelete.includes(t.$id)));

    try {
      await Promise.all(idsToDelete.map((taskId) => deleteTask(taskId)));
    } catch (err) {
      console.error(err);
      setTodos(previousTodos); // rollback
      setError("Couldn't delete task. Please try again.");
    }
  }

  // --- Build a nested tree (for rendering only) from the flat list ---
  function buildTree(parentId) {
    return getChildren(parentId).map((task) => ({
      ...task,
      // map Appwrite field names back to what TodoItem expects
      id: task.$id,
      text: task.taskName,
      completed: task.is_completed,
      subTodos: buildTree(task.$id),
    }));
  }

  const topLevelTodos = buildTree("");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading your tasks...
>>>>>>> dca63fa90a93c623f6774ad115ce60def8f4da71
      </div>
    );
  }

  return (
    <div>
<<<<<<< HEAD
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
=======
      <div className="flex items-center gap-3 bg-white rounded-2xl shadow-sm px-5 py-3 mb-6">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I want to..."
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
        />
        <button
          onClick={addTodo}
          className="px-5 py-3 rounded-full text-sm font-medium text-white whitespace-nowrap transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#18181b" }}
        >
          Add Task
        </button>
>>>>>>> dca63fa90a93c623f6774ad115ce60def8f4da71
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 text-xs font-medium">
            Dismiss
          </button>
        </div>
      )}

      {topLevelTodos.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "#f4f4f5" }}
          >
            <ClipboardCheck className="w-8 h-8" style={{ color: "#27272a" }} />
          </div>
          <p className="text-base font-medium text-gray-600">No todos yet.</p>
          <p className="text-sm text-gray-500 mt-1">Add your first task above to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {topLevelTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              onToggle={toggleTodo}
              onEdit={editTodo}
              onAddSub={(todoId, subText) => addSubTodo(todoId, subText)}
              onDeleteSub={(todoId, subId) => deleteTodo(subId)}
              onToggleSub={(todoId, subId) => toggleTodo(subId)}
              onEditSub={(todoId, subId, newText) => editTodo(subId, newText)}
              onAddNestedSub={(todoId, parentId, subText) => addSubTodo(parentId, subText)}
              onDeleteNestedSub={(todoId, parentId, subId) => deleteTodo(subId)}
              onToggleNestedSub={(todoId, parentId, subId) => toggleTodo(subId)}
              onEditNestedSub={(todoId, parentId, subId, newText) => editTodo(subId, newText)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoList;
