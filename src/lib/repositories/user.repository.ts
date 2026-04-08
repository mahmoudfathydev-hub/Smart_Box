import { BaseRepository } from "./base/base.repository";
import { userAdapter, User, UserRow } from "@/lib/adapters/user.adapter";

export class UserRepository extends BaseRepository<UserRow> {
  protected tableName = "users";

  static async getById(id: string): Promise<User | null> {
    const repository = new UserRepository();
    const row = await repository.getById(id);
    return row ? userAdapter.mapRowToUser(row) : null;
  }

  static async getByEmail(email: string): Promise<User | null> {
    const repository = new UserRepository();
    const row = await repository.findBy("email", email);
    return row ? userAdapter.mapRowToUser(row) : null;
  }

  static async create(userData: Omit<UserRow, "id" | "created_at">): Promise<User> {
    const repository = new UserRepository();
    const row = await repository.create(userData);
    return userAdapter.mapRowToUser(row);
  }

  static async update(id: string, updates: Partial<UserRow>): Promise<User> {
    const repository = new UserRepository();
    const row = await repository.update(id, updates);
    return userAdapter.mapRowToUser(row);
  }

  static async delete(id: string): Promise<void> {
    const repository = new UserRepository();
    await repository.delete(id);
  }

  static async getAll(
    params: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<{ users: User[]; count: number }> {
    const repository = new UserRepository();
    const result = await repository.getAll(params);
    return {
      users: result.data.map(userAdapter.mapRowToUser),
      count: result.count,
    };
  }

  static async getRawUserByEmail(email: string): Promise<UserRow | null> {
    const repository = new UserRepository();
    return await repository.findBy("email", email);
  }
}
