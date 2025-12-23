import { defineCollection, z } from 'astro:content';

const thoughtsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const projectsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    demoUrl: z.string().url().optional(),
    sourceUrl: z.string().url().optional(),
    status: z.enum(['active', 'archived', 'maintenance']).default('active'),
    featured: z.boolean().default(false),
  }),
});

const articlesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    updatedDate: z.date().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    links: z.record(z.string().url()).optional(),
    readTime: z.number().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const booksCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    status: z.enum(['in-progress', 'completed', 'planned']),
    version: z.string().optional(),
    date: z.date(),
    updatedDate: z.date().optional(),
    downloadUrl: z.string().url().optional(),
    sourceUrl: z.string().url().optional(),
    coverImage: z.string().optional(),
    parts: z.number().optional(),
    chapters: z.number().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  thoughts: thoughtsCollection,
  projects: projectsCollection,
  articles: articlesCollection,
  books: booksCollection,
};