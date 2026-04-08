import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Accessory } from "@/types/accessory";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body: Accessory = await request.json();

    // Validate required fields
    const requiredFields = ['name_en', 'name_ar', 'description_en', 'description_ar', 'type', 'brand_en', 'brand_ar', 'price'];
    const missingFields = requiredFields.filter(field => !body[field as keyof Accessory]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: "Missing required fields", missingFields },
        { status: 400 }
      );
    }

    // Insert accessory into database
    const { data, error } = await supabase
      .from('accessories')
      .insert([{
        name_en: body.name_en,
        name_ar: body.name_ar,
        description_en: body.description_en,
        description_ar: body.description_ar,
        type: body.type,
        brand_en: body.brand_en,
        brand_ar: body.brand_ar,
        price: body.price,
        discount: body.discount || 0,
        stock_quantity: body.stock_quantity || 0,
        sku: body.sku || null,
        image_url: body.image_url || null,
        compatible_devices: body.compatible_devices || [],
        is_active: body.is_active !== false, // Default to true
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating accessory:", error);
      return NextResponse.json(
        { error: "Failed to create accessory", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Accessory created successfully",
      accessory: data
    }, { status: 201 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const status = searchParams.get('status') || 'active';

    // Build query
    let query = supabase
      .from('accessories')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`name_en.ilike.%${search}%,name_ar.ilike.%${search}%,description_en.ilike.%${search}%,description_ar.ilike.%${search}%`);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (brand) {
      query = query.or(`brand_en.ilike.%${brand}%,brand_ar.ilike.%${brand}%`);
    }
    
    if (status !== 'all') {
      query = query.eq('is_active', status === 'active');
    }
    
    query = query.gte('price', minPrice).lte('price', maxPrice);

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Add ordering
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching accessories:", error);
      return NextResponse.json(
        { error: "Failed to fetch accessories", details: error.message },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      accessories: data || [],
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: count || 0,
        itemsPerPage: limit,
        hasNextPage,
        hasPreviousPage,
      },
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
