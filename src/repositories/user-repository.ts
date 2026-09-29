/**
 * 用户仓库：专门负责改 mockUsers。对外对象不带 password。
 */
import { mockUsers } from "@/data/mock-users";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserRecord,
} from "@/types";

let nextId = 1;
for (const user of mockUsers) {
  if (user.id >= nextId) {
    nextId = user.id + 1;
  }
}

function withoutPassword(user: UserRecord): User {
  const { password: _password, ...safe } = user;
  return safe;
}

function toNumber(id: string | number): number {
  return Number(id);
}

export function findAll(keyword = ""): User[] {
  const text = keyword.trim().toLowerCase();
  const result: User[] = [];

  for (const user of mockUsers) {
    const inUsername = user.username.toLowerCase().includes(text);
    const inName = user.name.toLowerCase().includes(text);
    if (!text || inUsername || inName) {
      result.push(withoutPassword(user));
    }
  }

  result.sort((left, right) => right.id - left.id);
  return result;
}

export function findById(id: string | number): User | null {
  const numberId = toNumber(id);
  for (const user of mockUsers) {
    if (user.id === numberId) {
      return withoutPassword(user);
    }
  }
  return null;
}

export function findByUsername(username: string): UserRecord | null {
  for (const user of mockUsers) {
    if (user.username === username) {
      return user;
    }
  }
  return null;
}

export function create(data: CreateUserInput): User {
  const item: UserRecord = {
    id: nextId,
    username: data.username.trim(),
    password: data.password,
    name: data.name.trim(),
    role: data.role,
    status: data.status,
    email: data.email.trim(),
    createdAt: new Date().toISOString(),
  };
  nextId += 1;
  mockUsers.push(item);
  return withoutPassword(item);
}

export function update(id: string | number, data: UpdateUserInput): User | null {
  const numberId = toNumber(id);
  const index = mockUsers.findIndex((user) => user.id === numberId);
  if (index === -1) {
    return null;
  }

  const oldItem = mockUsers[index];
  mockUsers[index] = {
    id: oldItem.id,
    username: oldItem.username,
    createdAt: oldItem.createdAt,
    name: data.name.trim(),
    role: data.role,
    status: data.status,
    email: data.email.trim(),
    password: data.password ? data.password : oldItem.password,
  };
  return withoutPassword(mockUsers[index]);
}

export function remove(id: string | number): boolean {
  const numberId = toNumber(id);
  const index = mockUsers.findIndex((user) => user.id === numberId);
  if (index === -1) {
    return false;
  }
  mockUsers.splice(index, 1);
  return true;
}

export function countUsers(): number {
  return mockUsers.length;
}
