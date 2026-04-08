import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  created_at: string;
  name: string;
  email: string;
  password: string;
  number: string;
  country: string;
  countryCode: string;
  image_url: string;
  role: "user" | "admin" | "employee";
}

export interface Employee {
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

export const supabaseService = {
  // Users table operations
  async createUser(userData: Omit<User, "id" | "created_at">) {
    const { data, error } = await supabase.from("users").insert([userData]).select().single();

    if (error) throw error;
    return data;
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async getUserById(id: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single();

    if (error) throw error;
    return data;
  },

  // Employee table operations
  async createEmployee(employeeData: Omit<Employee, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("employees")
      .insert([employeeData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getEmployeeByEmail(email: string) {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },
};
