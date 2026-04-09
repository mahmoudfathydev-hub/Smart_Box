import { createSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createSupabaseClient();
    
    // Try to get table info by selecting a few rows
    const { data, error } = await supabase
      .from("Accessories")
      .select("*")
      .limit(1);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      return NextResponse.json({ 
        message: "Table structure found",
        columns: columns,
        sampleRow: data[0]
      });
    }
    
    return NextResponse.json({ message: "No data in table" });
    
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
