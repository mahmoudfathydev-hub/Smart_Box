import { BaseRepository } from './base/base.repository';
import { employeeAdapter, Employee, EmployeeRow } from '@/lib/adapters/user.adapter';

export class EmployeeRepository extends BaseRepository<EmployeeRow> {
  protected tableName = 'employees';

  static async getById(id: string): Promise<Employee | null> {
    const repository = new EmployeeRepository();
    const row = await repository.getById(id);
    return row ? employeeAdapter.mapRowToEmployee(row) : null;
  }

  static async getByEmail(email: string): Promise<Employee | null> {
    const repository = new EmployeeRepository();
    const row = await repository.findBy('email', email);
    return row ? employeeAdapter.mapRowToEmployee(row) : null;
  }

  static async create(employeeData: Omit<EmployeeRow, 'id' | 'created_at'>): Promise<Employee> {
    const repository = new EmployeeRepository();
    const row = await repository.create(employeeData);
    return employeeAdapter.mapRowToEmployee(row);
  }

  static async update(id: string, updates: Partial<EmployeeRow>): Promise<Employee> {
    const repository = new EmployeeRepository();
    const row = await repository.update(id, updates);
    return employeeAdapter.mapRowToEmployee(row);
  }

  static async delete(id: string): Promise<void> {
    const repository = new EmployeeRepository();
    await repository.delete(id);
  }

  static async getAll(params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ employees: Employee[]; count: number }> {
    const repository = new EmployeeRepository();
    const result = await repository.getAll(params);
    return {
      employees: result.data.map(employeeAdapter.mapRowToEmployee),
      count: result.count
    };
  }
}
