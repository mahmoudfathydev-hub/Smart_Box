import { supabase } from "@/lib/supabase";

export abstract class BaseRepository<T> {
  protected abstract tableName: string;

  protected async getById(id: string | number): Promise<T | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  }

  protected async getAll(
    params: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      select?: string;
    } = {},
  ): Promise<{ data: T[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "desc",
      select = "*",
    } = params;

    let query = supabase
      .from(this.tableName)
      .select(select, { count: "exact" })
      .order(sortBy, { ascending: sortOrder === "asc" });

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: (data || []) as T[], count: count || 0 };
  }

  protected async create(item: Omit<T, "id" | "created_at">): Promise<T> {
    const { data, error } = await supabase.from(this.tableName).insert(item).select().single();

    if (error) throw error;
    return data;
  }

  protected async update(id: string | number, updates: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  protected async delete(id: string | number): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);

    if (error) throw error;
  }

  protected async findBy(field: string, value: any): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq(field, value)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  }

  protected async findMany(
    field: string,
    value: any,
    options: {
      limit?: number;
      orderBy?: string;
      orderDirection?: "asc" | "desc";
    } = {},
  ): Promise<T[]> {
    const { limit, orderBy = "created_at", orderDirection = "desc" } = options;

    let query = supabase
      .from(this.tableName)
      .select("*")
      .eq(field, value)
      .order(orderBy, { ascending: orderDirection === "asc" });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []) as T[];
  }
}
