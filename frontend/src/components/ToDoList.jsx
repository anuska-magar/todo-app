import { useState, useEffect, useRef } from "react";
import { ClipboardCheck, Loader2, CheckCircle, AlertCircle, X } from "lucide-react";
import Input from "./Input";
import TodoItem from "./TodoItem";
import { getCurrentUser } from "../utils/auth";
import { createTask, getUserTasks, updateTask, deleteTask } from "../appwrite/tasks";

function TodoList({ onCountChange }) {
  const [todos, setTodos] = useState([]); // flat list, each: { $id, taskName, is_completed, parentId, userId, ... }
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  function showToast(type, title, message) {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToast({ type, title, message });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2800);
  }

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
        console.log(res);
        console.log(res.documents);
        setTodos(res.documents ?? []);
      console.log(JSON.stringify(res.documents, null, 2));
      } catch (err) {
        console.error(err);
        showToast("error", "Failed to load tasks", "Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // --- Report counts up to parent (Header stats) ---
  useEffect(() => {
    if (onCountChange) {
      onCountChange(todos.length, todos.filter((t) => t.is_completed).length);
    }
  }, [todos, onCountChange]);

  // --- Tree helpers (derive nesting from flat parentId list) ---
  function getChildren(parentId) {
  return todos.filter(
    t =>
      (t.parentId ?? "") === (parentId ?? "")
  );
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
    if (text.trim() === "") {
      showToast("error", "Task is empty", "Please enter a task before adding it.");
      return;
    }

    if (!userId) {
      showToast("error", "Unable to add task", "Please sign in again and try.");
      return;
    }

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
      showToast("success", "Task added", "Your new task was added successfully.");
    } catch (err) {
      console.error(err);
      setTodos((prev) => prev.filter((t) => t.$id !== tempId));
      showToast("error", "Couldn't add task", "Please try again.");
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
      showToast("error", "Couldn't add sub-task", "Please try again.");
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
      if (newCompleted) {
        showToast("success", "Task completed", "Nice work finishing this task.");
      }
    } catch (err) {
      console.error(err);
      setTodos(previousTodos); // rollback
      showToast("error", "Couldn't update task", "Please try again.");
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
      showToast("error", "Couldn't save changes", "Please try again.");
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
      showToast("error", "Couldn't delete task", "Please try again.");
    }
  }

  // --- Build a nested tree (for rendering only) from the flat list ---
  function buildTree(parentId, path = []) {
  console.log("Building:", parentId);

  const children = getChildren(parentId);

  return children.map(task => {
    if (path.includes(task.$id)) {
      console.error("CYCLE FOUND!");
      console.log("Current path:", path);
      console.log("Current task:", task);
      return {
        ...task,
        id: task.$id,
        text: task.taskName,
        completed: task.is_completed,
        subTodos: [],
      };
    }

    return {
      ...task,
      id: task.$id,
      text: task.taskName,
      completed: task.is_completed,
      subTodos: buildTree(task.$id, [...path, task.$id]),
    };
  });
}
  const topLevelTodos = buildTree(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading your tasks...
      </div>
    );
  }

  return (
    <div>
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
      </div>

      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-4 w-72">
            <div className="flex items-start gap-3">
              {toast.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{toast.message}</p>
              </div>
              <button onClick={() => setToast(null)}>
                <X className="w-4 h-4 text-gray-300 hover:text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>

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