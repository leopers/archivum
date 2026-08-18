import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    topics: z.array(z.string()),
    draft: z.boolean().default(false),
    status: z.enum(["under-construction", "complete"]).default("complete"),
    featured: z.boolean().default(false),
  }),
});

const writingPt = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing-pt" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    topics: z.array(z.string()),
    draft: z.boolean().default(false),
    status: z.enum(["under-construction", "complete"]).default("complete"),
    featured: z.boolean().default(false),
  }),
});

const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  year: z.number(),
  topics: z.array(z.string()),
  status: z.enum(["ongoing", "complete", "archived"]),
  featured: z.boolean().default(false),
  repo: z.string().url().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: projectSchema,
});

const projectsFr = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects-fr" }),
  schema: projectSchema,
});

const music = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/music" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    topics: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing, writingPt, projects, projectsFr, music };
