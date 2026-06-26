import { useState, useEffect } from "react";
import { ClipboardCheck, Loader2 } from "lucide-react";
import Input from "./Input";
import TodoItem from "./TodoItem";
import { getCurrentUser } from "../utils/auth";
import { createTask, getUserTasks, updateTask, deleteTask } from "../appwrite/tasks";

function TodoList({ onCountChange }) {
  const [todos, setTodos] = useState([]); // flat list, each: { $id, taskName, is_completed, parentId, userId, ... }
  const [text, setText] = useState("");
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
        console.log(res);
        console.log(res.documents);
        setTodos(res.documents ?? []);
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