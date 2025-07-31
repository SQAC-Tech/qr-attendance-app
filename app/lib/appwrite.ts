import { Account, Client, Databases, ID } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // replace if using self-hosted
  .setProject('68890bd400275c628b76'); // your actual Appwrite project ID

const account = new Account(client);
const databases = new Databases(client); // ⬅️ This is what's missing

// ✅ Auth Functions
export async function getCurrentSession(): Promise<boolean> {
  try {
    const session = await account.getSession('current');
    return !!session;
  } catch (error) {
    return false;
  }
}

export async function login(email: string, password: string) {
  return account.createEmailPasswordSession(email, password);
}

export async function signup(email: string, password: string, name: string) {
  return account.create(ID.unique(), email, password, name);
}

export async function logout() {
  return account.deleteSession('current');
}

// ✅ Export everything needed
export { account, client, databases, ID };
