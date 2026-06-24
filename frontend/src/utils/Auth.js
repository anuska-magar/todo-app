import { account, databases, DB_ID, USERS_COLLECTION_ID } from "../appwrite/config";
import { ID } from "appwrite";

export async function registerUser(name, email, password) {
  try {
    try {
      await account.deleteSession("current");
    } catch {
      // no session active, continue
    }
    const newAccount = await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);
    await databases.createDocument(DB_ID, USERS_COLLECTION_ID, newAccount.$id, {
      userName: name,
    });
    return { success: true, message: "Account created successfully!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function loginUser(email, password) {
  try {
    await account.createEmailPasswordSession(email, password);
    return { success: true, message: "Login successful!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function isLoggedIn() {
  try {
    await account.get();
    return true;
  } catch {
    return false;
  }
}

export async function logoutUser() {
  try {
    await account.deleteSession("current");
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}