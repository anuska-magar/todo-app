import { databases, DB_ID, TASKS_COLLECTION_ID } from "./config";
import { ID, Query } from "appwrite";

export const createTask = async (taskData) => {
  return await databases.createDocument(DB_ID, TASKS_COLLECTION_ID, ID.unique(), {
    taskName: taskData.taskName,
    is_completed: false,
    userId: taskData.userId,
    priority: taskData.priority || "medium",
    description: taskData.description || "",
    parentId: taskData.parentId || "",
  });
};

export const getUserTasks = async (userId) => {
  return await databases.listDocuments(DB_ID, TASKS_COLLECTION_ID, [
    Query.equal("userId", userId),
  ]);
};

export const updateTask = async (taskId, updatedFields) => {
  return await databases.updateDocument(DB_ID, TASKS_COLLECTION_ID, taskId, {
    ...updatedFields,
  });
};

export const deleteTask = async (taskId) => {
  return await databases.deleteDocument(DB_ID, TASKS_COLLECTION_ID, taskId);
};