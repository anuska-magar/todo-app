import { databases, DB_ID, TASKS_COLLECTION_ID } from "./config";
import { ID, Query } from "appwrite";

// CREATE
export const createTask = async (taskData) => {
  return await databases.createDocument(DB_ID, TASKS_COLLECTION_ID, ID.unique(), {
    taskName: taskData.taskName,
    is_completed: false,
    userId: taskData.userId,
    priority: taskData.priority || "medium",
    description: taskData.description || "",
    parentId: taskData.parentId || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

// GET ALL TASKS OF A USER
export const getUserTasks = async (userId) => {
  return await databases.listDocuments(DB_ID, TASKS_COLLECTION_ID, [
    Query.equal("userId", userId),
  ]);
};

// UPDATE
export const updateTask = async (taskId, updatedFields) => {
  return await databases.updateDocument(DB_ID, TASKS_COLLECTION_ID, taskId, {
    ...updatedFields,
    updatedAt: new Date().toISOString(),
  });
};

// DELETE
export const deleteTask = async (taskId) => {
  return await databases.deleteDocument(DB_ID, TASKS_COLLECTION_ID, taskId);
};