import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { supabase } from "@/lib/supabase";
import { IS_PROD } from "@/lib/config";

const querySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

interface SearchLogRow {
  ip_address: string;
  username: string;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase client not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const { from, to } = querySchema.parse(
      Object.fromEntries(searchParams)
    );

    // Build the query using Supabase query builder
    let query = supabase
      .from("search_logs")
      .select("ip_address, username, created_at", { count: "exact" })
      .is("thread_id", null);

    // Add date filters if provided
    if (from) {
      query = query.gte("created_at", from.toISOString());
    }

    if (to) {
      query = query.lte("created_at", to.toISOString());
    }

    // Exclude desci.com users in production
    if (IS_PROD) {
      query = query.not("username", "like", "%@desci.com");
    }

    // Fetch ALL data - Supabase defaults to 1000 rows, so we need to paginate
    let allData: SearchLogRow[] = [];
    let hasMore = true;
    let offset = 0;
    const limit = 1000;

    while (hasMore) {
      const { data: rawData, error } = await query.range(offset, offset + limit - 1);
      
      if (error) {
        throw error;
      }

      if (rawData && rawData.length > 0) {
        allData = allData.concat(rawData as SearchLogRow[]);
        offset += limit;
        hasMore = rawData.length === limit;
      } else {
        hasMore = false;
      }
    }

    // Aggregate data by IP address in JavaScript
    const ipMap = new Map<string, {
      total_hits: number;
      anon_hits: number;
      user_hits: number;
      first_seen: string;
      last_seen: string;
    }>();

    (allData || []).forEach((row) => {
      const existing = ipMap.get(row.ip_address);
      const isAnon = row.username.startsWith("anon");

      if (existing) {
        existing.total_hits++;
        if (isAnon) {
          existing.anon_hits++;
        } else {
          existing.user_hits++;
        }
        if (row.created_at < existing.first_seen) {
          existing.first_seen = row.created_at;
        }
        if (row.created_at > existing.last_seen) {
          existing.last_seen = row.created_at;
        }
      } else {
        ipMap.set(row.ip_address, {
          total_hits: 1,
          anon_hits: isAnon ? 1 : 0,
          user_hits: isAnon ? 0 : 1,
          first_seen: row.created_at,
          last_seen: row.created_at,
        });
      }
    });

    // Convert map to array and calculate percentages
    const transformedData = Array.from(ipMap.entries())
      .map(([ip_address, stats]) => ({
        ip_address,
        total_hits: stats.total_hits,
        anon_hits: stats.anon_hits,
        user_hits: stats.user_hits,
        anon_pct: (stats.anon_hits / stats.total_hits) * 100,
        first_seen: stats.first_seen,
        last_seen: stats.last_seen,
      }))
      .sort((a, b) => {
        // Sort by anon_hits desc, then total_hits desc
        if (b.anon_hits !== a.anon_hits) {
          return b.anon_hits - a.anon_hits;
        }
        return b.total_hits - a.total_hits;
      });

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching IP usage analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch IP usage analytics" },
      { status: 500 }
    );
  }
}

