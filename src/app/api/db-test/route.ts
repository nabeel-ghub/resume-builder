import { db } from "~/server/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT NOW()`);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return new Response(errorMessage, { status: 500 });
  }
}