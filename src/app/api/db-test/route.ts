import { db } from "~/server/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT NOW()`);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
}