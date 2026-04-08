import bcrypt from "bcryptjs";
import { UserRepository } from "@/lib/repositories/user.repository";
import { EmployeeRepository } from "@/lib/repositories/employee.repository";
import { User, Employee } from "@/lib/adapters/user.adapter";

export class AuthService {
  // Business logic: User registration with validation
  static async registerUser(userData: {
    name: string;
    email: string;
    password: string;
    number: string;
    country: string;
    countryCode: string;
    role: "user" | "admin" | "employee";
    accessKey?: string;
  }): Promise<Omit<User, "password">> {
    // Business rule: Validate access key for admin/employee
    if (userData.role === "admin" || userData.role === "employee") {
      if (!this.validateAccessKey(userData.role, userData.accessKey)) {
        throw new Error("Invalid access key for selected role");
      }
    }

    // Business rule: Check if user already exists
    const existingUser = await UserRepository.getByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Business rule: Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const userToCreate = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      number: userData.number,
      country: userData.country,
      countryCode: userData.countryCode,
      role: userData.role,
      image_url: null,
    };

    const user = await UserRepository.create(userToCreate);

    // UserRepository already returns User type without password
    return user;
  }

  // Business logic: User authentication
  static async authenticateUser(email: string, password: string): Promise<User> {
    const user = await UserRepository.getByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // We need to get the raw user data to check password
    const userWithPassword = await UserRepository.getRawUserByEmail(email);
    if (!userWithPassword) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, userWithPassword.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Return user without password (User type doesn't include password)
    return user;
  }

  // Business logic: Employee registration
  static async registerEmployee(employeeData: {
    name: string;
    email: string;
    password: string;
    image: string;
    salary?: number;
    department?: string;
    jobTitle?: string;
    workSchedule?: string;
    accessKey?: string;
  }): Promise<Employee> {
    // Business rule: Validate access key
    if (!this.validateAccessKey("employee", employeeData.accessKey)) {
      throw new Error("Invalid access key for employee role");
    }

    // Business rule: Check if employee already exists
    const existingEmployee = await EmployeeRepository.getByEmail(employeeData.email);
    if (existingEmployee) {
      throw new Error("Employee with this email already exists");
    }

    // Business rule: Hash password
    const hashedPassword = await bcrypt.hash(employeeData.password, 12);

    const employeeToCreate = {
      name: employeeData.name,
      email: employeeData.email,
      password: hashedPassword,
      image: employeeData.image,
      salary: employeeData.salary,
      department: employeeData.department,
      job_title: employeeData.jobTitle,
      work_schedule: employeeData.workSchedule,
    };

    return EmployeeRepository.create(employeeToCreate);
  }

  // Business logic: Access key validation
  private static validateAccessKey(role: string, accessKey?: string): boolean {
    const ACCESS_KEYS = {
      admin: "Admin12345",
      employee: "employee12345",
    };

    return accessKey === ACCESS_KEYS[role as keyof typeof ACCESS_KEYS];
  }

  // Business logic: Permission checking
  static hasPermission(user: User, requiredRole: "user" | "admin" | "employee"): boolean {
    const roleHierarchy: Record<string, number> = {
      user: 0,
      employee: 1,
      admin: 2,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }
}
