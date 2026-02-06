"use client";

import { BlogCard } from "./blog-card";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Memulai dengan Next.js 16",
    content:
      "Pelajari cara memulai project Next.js 16 dengan fitur-fitur terbaru termasuk Turbopack, React Compiler, dan peningkatan performa yang signifikan.",
    date: "15 Januari 2025"
  },
  {
    id: "2",
    title: "Best Practices Tailwind CSS",
    content:
      "Pahami best practices menggunakan Tailwind CSS untuk membuat design system yang konsisten dan maintainable di project React Anda.",
    date: "10 Januari 2025"
  },
  {
    id: "3",
    title: "Authentication dengan NextAuth",
    content:
      "Panduan lengkap mengimplementasikan authentication yang aman menggunakan NextAuth.js dan database modern seperti Supabase.",
    date: "5 Januari 2025"
  },
  {
    id: "4",
    title: "Server Components vs Client Components",
    content:
      "Pelajari perbedaan antara Server Components dan Client Components di Next.js 16 dan bagaimana memilih yang tepat untuk use case Anda.",
    date: "1 Januari 2025"
  }
];

export function BlogSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Blog
          </h2>
          <p className="text-lg text-muted-foreground">
            Content dibawah di ambil dari API yang sudah di buat di project ini.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              content={post.content}
              date={post.date}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
