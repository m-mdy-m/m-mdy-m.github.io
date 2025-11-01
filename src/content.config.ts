import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    demoUrl: z.string().optional(),
    sourceUrl: z.string().optional(),
  }),
});

const articlesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    links: z.record(z.string()).optional(),
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
    downloadUrl: z.string().optional(),
    sourceUrl: z.string().optional(),
    parts: z.number().optional(),
    chapters: z.number().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
  projects: projectsCollection,
  articles: articlesCollection,
  books: booksCollection,
};