import { use } from "react";

import { sleep } from "../../_components/delay";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  body: string;
}

const POSTS: Post[] = [
  {
    id: "1",
    title: "Filesystem routing for React Router",
    excerpt: "Drop a page.tsx into a folder; you've got a route.",
    body: "Conventions like layout.tsx, error.tsx and loading.tsx all colocate inside the folder they describe. Nesting is automatic.",
  },
  {
    id: "2",
    title: "Typed params, for free",
    excerpt: "The Vite plugin generates a typed `generate(...)` per route.",
    body: "Link to a dynamic route without stringly-typed paths. `generate({ postId: '1' })` returns '/posts/1' and refuses to compile if the shape is wrong.",
  },
  {
    id: "3",
    title: "Suspense-driven loading",
    excerpt: "loading.tsx is a Suspense fallback the framework wires for you.",
    body: "Any descendant that suspends — including this page — falls back to the nearest loading.tsx automatically.",
  },
];

let postsPromise: Promise<Post[]> | null = null;
const postPromises = new Map<string, Promise<Post | null>>();

function loadPosts(): Promise<Post[]> {
  postsPromise ??= sleep(600).then(() => POSTS);
  return postsPromise;
}

function loadPost(id: string): Promise<Post | null> {
  let p = postPromises.get(id);
  if (!p) {
    p = sleep(500).then(() => POSTS.find((post) => post.id === id) ?? null);
    postPromises.set(id, p);
  }
  return p;
}

export function usePosts(): Post[] {
  return use(loadPosts());
}

export function usePost(id: string): Post | null {
  return use(loadPost(id));
}
