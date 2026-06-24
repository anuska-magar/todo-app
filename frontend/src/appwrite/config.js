import { Client, Databases, Account } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6a3a7a9a0039a41bc95a");

export const account = new Account(client);
export const databases = new Databases(client);

export const DB_ID = "fhalkdhsfw9efdjf_12ujnjfn23";
export const USERS_COLLECTION_ID = "adjfaheufhdsjusershajheru";
export const TASKS_COLLECTION_ID = "lkadkfnehtaskslakshdkgf";