"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { Blog } from "../services/blog-service";

interface BlogDetailProps {
  blog: Blog;
}

export function BlogDetail({ blog }: BlogDetailProps) {
  const date = new Date(blog.createdAt).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short"
  });
  return (
    <article className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link href="/posts">
          <Button variant="ghost" className="mb-8 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar
          </Button>
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            {blog.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            Dipublikasikan pada {date}
          </p>
        </header>

        {/* Article Content */}
        <div className="prose prose-invert max-w-none">
          <div className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
            {blog.content}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <Link href="/posts">
            <Button variant="outline">Kembali ke Blog</Button>
          </Link>
        </footer>
      </div>
    </article>
  );
}
