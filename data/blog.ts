// Blog posts. Pulled from the public MegaEvolution blog (the fetch script is in /legacy);
// treated as placeholder articles here. Remote images are not used — tiles are flat placeholders.
import { BLOG_POSTS, BLOG_CATEGORIES } from './blogPosts'

export type Post = { slug: string; title: string; date: string; category: string; excerpt: string; body: any; tone: number }
export const BLOG: Post[] = (BLOG_POSTS as any[]).map((p, i) => ({ slug: p.slug, title: p.title, date: p.date, category: p.category, excerpt: p.excerpt, body: p.body, tone: [0, 2, 1, 4, 5, 3, 6, 7][i % 8] }))
export const BLOG_TOPICS: string[] = BLOG_CATEGORIES
export const postBySlug = Object.fromEntries(BLOG.map((p) => [p.slug, p]))
