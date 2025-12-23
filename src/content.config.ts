import { defineCollection, z } from 'astro:content';

const thoughtsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    mood: z.enum(['reflective', 'technical', 'personal', 'philosophical']).optional(),
  }),
});

const projectsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string().url().optional(),
    repository: z.string().url(),
    status: z.enum(['active', 'archived', 'maintenance']).default('active'),
  }),
});

const articlesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    links: z.record(z.string().url()).optional(),
  }),
});

const booksCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    status: z.enum(['in-progress', 'completed', 'planned']),
    repository: z.string().url(),
    pdf: z.string().url().optional(),
    cover: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  thoughts: thoughtsCollection,
  projects: projectsCollection,
  articles: articlesCollection,
  books: booksCollection,  
};