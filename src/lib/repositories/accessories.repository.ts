import { supabase } from "@/lib/supabase";
import { Accessory, AccessoryRow, AccessoryQueryParams, AccessoriesResponse } from "@/types/accessory";
import { accessoryAdapter } from "@/lib/adapters/accessory.adapter";

/**
 * Accessories Repository
 * Single source of truth for all accessory data operations
 */
export class AccessoriesRepository {
  private static readonly TABLE_NAME = "accessories";

  /**
   * Get all accessories with filtering and pagination
   */
  static async getAllAccessories(params: AccessoryQueryParams = {}): Promise<AccessoriesResponse> {
    const {
      page = 1,
      limit = 12,
      type,
      brand,
      search,
      minPrice,
      maxPrice,
      status,
      compatibleDevices,
      sortBy = "created_at",
      sortOrder = "desc",
    } = params;

    let query = supabase.from(this.TABLE_NAME).select("*", { count: "exact" });

    // Apply filters
    if (search) {
      query = query.or(
        `name_en.ilike.%${search}%,name_ar.ilike.%${search}%,description_en.ilike.%${search}%,description_ar.ilike.%${search}%`,
      );
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (brand) {
      query = query.ilike("brand", `%${brand}%`);
    }

    if (minPrice !== undefined) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte("price", maxPrice);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (compatibleDevices && compatibleDevices.length > 0) {
      query = query.contains("compatible_devices", compatibleDevices);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch accessories: ${error.message}`);
    }

    const accessories = (data || []).map(accessoryAdapter.mapAccessoryRow);

    return {
      accessories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil((count || 0) / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Get single accessory by slug (using name_en as slug)
   */
  static async getAccessoryBySlug(slug: string): Promise<Accessory | null> {
    let data, error;

    // Try to find by name_en (treating name_en as slug)
    const result = await supabase.from(this.TABLE_NAME).select("*").eq("name_en", slug).single();

    data = result.data;
    error = result.error;

    // If not found by exact name match, try ID fallback
    if (!data && error?.code === "PGRST116") {
      const numericId = parseInt(slug);
      if (!isNaN(numericId)) {
        const idResult = await supabase
          .from(this.TABLE_NAME)
          .select("*")
          .eq("id", numericId)
          .single();

        data = idResult.data;
        error = idResult.error;
      }
    }

    // If still not found, try partial name match
    if (!data && error?.code === "PGRST116") {
      const nameResult = await supabase
        .from(this.TABLE_NAME)
        .select("*")
        .ilike("name_en", `%${slug}%`)
        .limit(1)
        .single();

      data = nameResult.data;
      error = nameResult.error;
    }

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Accessory not found
      }
      throw new Error(`Failed to fetch accessory: ${error.message}`);
    }

    return accessoryAdapter.mapAccessoryRow(data);
  }

  /**
   * Get featured accessories (newest accessories)
   */
  static async getFeaturedAccessories(limit: number = 8): Promise<Accessory[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch featured accessories: ${error.message}`);
    }

    return (data || []).map(accessoryAdapter.mapAccessoryRow);
  }

  /**
   * Get accessories by type
   */
  static async getAccessoriesByType(type: string, limit: number = 12): Promise<Accessory[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .eq("type", type)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch accessories by type: ${error.message}`);
    }

    return (data || []).map(accessoryAdapter.mapAccessoryRow);
  }

  /**
   * Get related accessories by type
   */
  static async getRelatedAccessories(
    type: string,
    excludeSlug: string,
    limit: number = 8,
  ): Promise<Accessory[]> {
    // First, get the accessory ID from the slug since slug column doesn't exist in DB
    const { data: accessoryData, error: accessoryError } = await supabase
      .from(this.TABLE_NAME)
      .select("id, name_en")
      .eq("status", "active")
      .limit(1000);

    if (accessoryError) {
      throw new Error(`Failed to fetch accessories for slug lookup: ${accessoryError.message}`);
    }

    // Find the accessory ID that matches the excludeSlug
    const excludeAccessory = accessoryData?.find((accessory) => {
      const generatedSlug =
        accessory.name_en
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim() || `accessory-${accessory.id}`;
      return generatedSlug === excludeSlug;
    });

    const excludeAccessoryId = excludeAccessory?.id;

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .eq("type", type)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit + (excludeAccessoryId ? 1 : 0)); // Get extra to account for exclusion

    if (error) {
      throw new Error(`Failed to fetch related accessories: ${error.message}`);
    }

    // Filter out the excluded accessory by ID
    const filteredData = (data || []).filter((accessory) => accessory.id !== excludeAccessoryId);

    return filteredData.slice(0, limit).map(accessoryAdapter.mapAccessoryRow);
  }

  /**
   * Search accessories
   */
  static async searchAccessories(query: string, limit: number = 12): Promise<Accessory[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .or(
        `name_en.ilike.%${query}%,name_ar.ilike.%${query}%,description_en.ilike.%${query}%,description_ar.ilike.%${query}%`,
      )
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to search accessories: ${error.message}`);
    }

    return (data || []).map(accessoryAdapter.mapAccessoryRow);
  }

  /**
   * Get accessories on sale
   */
  static async getAccessoriesOnSale(limit: number = 12): Promise<Accessory[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .gt("discount", 0)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch sale accessories: ${error.message}`);
    }

    return (data || []).map(accessoryAdapter.mapAccessoryRow);
  }

  /**
   * Get accessories by brand
   */
  static async getAccessoriesByBrand(brand: string, limit: number = 12): Promise<Accessory[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .ilike("brand", `%${brand}%`)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch accessories by brand: ${error.message}`);
    }

    return (data || []).map(accessoryAdapter.mapAccessoryRow);
  }

  /**
   * Create new accessory
   */
  static async createAccessory(accessory: Partial<AccessoryRow>): Promise<Accessory> {
    const { data, error } = await supabase.from(this.TABLE_NAME).insert(accessory).select().single();

    if (error) {
      throw new Error(`Failed to create accessory: ${error.message}`);
    }

    return accessoryAdapter.mapAccessoryRow(data);
  }

  /**
   * Update accessory
   */
  static async updateAccessory(id: number, updates: Partial<AccessoryRow>): Promise<Accessory> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update accessory: ${error.message}`);
    }

    return accessoryAdapter.mapAccessoryRow(data);
  }

  /**
   * Delete accessory
   */
  static async deleteAccessory(id: number): Promise<void> {
    const { error } = await supabase.from(this.TABLE_NAME).delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete accessory: ${error.message}`);
    }
  }
}
