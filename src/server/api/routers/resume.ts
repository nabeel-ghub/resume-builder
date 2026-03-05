import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { resumes } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

const resumeItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  role: z.string(),
  link: z.string().url().optional().or(z.literal("")),
  description: z.string(),
  bullet1: z.string().nullable(),
  bullet2: z.string().nullable(),
  bullet3: z.string().nullable(),
});

export const resumeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional(),
        address: z.string().optional(),
        summary: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
        skills: z.array(z.object({ id: z.number(), title: z.string() })),
        experiences: z.array(resumeItemSchema),
        projects: z.array(resumeItemSchema),
        educations: z.array(resumeItemSchema),
      }),
    )

    .mutation(async ({ ctx, input }) => {
      const newResume = await ctx.db
        .insert(resumes)
        .values({
          ...input,
          userId: ctx.user.id,
        })
        .returning();

      return newResume[0];
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, ctx.user.id));
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(resumes)
        .where(and(eq(resumes.id, input.id), eq(resumes.userId, ctx.user.id)));
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional(),
        address: z.string().optional(),
        summary: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
        skills: z.array(z.object({ id: z.number(), title: z.string() })),
        experiences: z.array(resumeItemSchema),
        projects: z.array(resumeItemSchema),
        educations: z.array(resumeItemSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const [updatedResume] = await ctx.db
        .update(resumes)
        .set({
          ...updateData,
          lastEdited: new Date(),
        })
        .where(and(eq(resumes.id, id), eq(resumes.userId, ctx.user.id)))
        .returning();

      if (!updatedResume) {
        throw new Error("Resume not found or unauthorized");
      }

      return updatedResume;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [resume] = await ctx.db
        .select()
        .from(resumes)
        .where(and(eq(resumes.id, input.id), eq(resumes.userId, ctx.user.id)));

      if (!resume) {
        throw new Error("Resume not found or unauthorized");
      }

      return resume;
    }),
});
