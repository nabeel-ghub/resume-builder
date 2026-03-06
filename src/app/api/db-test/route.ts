import { db } from "~/server/db";
import { resumes } from "~/server/db/schema"; // Ensure this import is correct

export async function GET() {
  try {
    const result = await db.select().from(resumes).limit(1);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    // This will tell us if it's "relation 'resumes' does not exist"
    return new Response(msg, { status: 500 });
  }
}