import { account, databases, DB_ID, USERS_COLLECTION_ID } from "./config";
import { ID } from "appwrite";

// REGISTER
export const registerUser = async (email, password, username) => {
  const newAccount = await account.create(ID.unique(), email, password, username);
  await account.createEmailPasswordSession(email, password);
  await databases.createDocument(DB_ID, USERS_COLLECTION_ID, newAccount.$id, {
    username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar_url: "",
  });
  return newAccount;
};

// LOGIN
export const loginUser = async (email, password) => {
  return await account.createEmailPasswordSession(email, password);
};

// LOGOUT
export const logoutUser = async () => {
  return await account.deleteSession("current");
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  return await account.get();
};