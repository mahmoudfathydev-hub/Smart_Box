// Types for User and Employee
export interface User {
  id: string;
  name: string;
  email: string;
  number: string;
  country: string;
  countryCode: string;
  imageUrl: string | null;
  role: "user" | "admin" | "employee";
  createdAt: string;
}

export interface UserRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  password: string;
  number: string;
  country: string;
  countryCode: string;
  image_url: string | null;
  role: "user" | "admin" | "employee";
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  image: string;
  salary?: number;
  department?: string;
  jobTitle?: string;
  workSchedule?: string;
  createdAt: string;
}

export interface EmployeeRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  password: string;
  image: string;
  salary?: number;
  department?: string;
  job_title?: string;
  work_schedule?: string;
}

export const userAdapter = {
  mapRowToUser(row: UserRow): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      number: row.number,
      country: row.country,
      countryCode: row.countryCode,
      imageUrl: row.image_url,
      role: row.role,
      createdAt: row.created_at,
      // Password never exposed to UI
    };
  },

  mapUserToRow(user: Partial<User>): Partial<UserRow> {
    return {
      name: user.name,
      email: user.email,
      number: user.number,
      country: user.country,
      countryCode: user.countryCode,
      image_url: user.imageUrl,
      role: user.role,
    };
  },
};

export const employeeAdapter = {
  mapRowToEmployee(row: EmployeeRow): Employee {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      image: row.image,
      salary: row.salary,
      department: row.department,
      jobTitle: row.job_title,
      workSchedule: row.work_schedule,
      createdAt: row.created_at,
    };
  },

  mapEmployeeToRow(employee: Partial<Employee>): Partial<EmployeeRow> {
    return {
      name: employee.name,
      email: employee.email,
      image: employee.image,
      salary: employee.salary,
      department: employee.department,
      job_title: employee.jobTitle,
      work_schedule: employee.workSchedule,
    };
  },
};
