"use client";

import { BlogCard } from "./blog-card";
import { useEffect, useState } from "react";
import { blogService, type Blog } from "../services/blog-service";

function formatDate(date: string) {
  return new Date(date).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

export function BlogSection() {
  const [items, setItems] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    blogService
      .getAll()
      .then((res) => {
        if (!cancelled) {
          setItems(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message ?? "Gagal memuat data");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

        {loading && <p className="text-muted-foreground">Memuat data…</p>}
        {error && (
          <p className="text-destructive">Terjadi kesalahan: {error}</p>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                content={post.content}
                date={formatDate(post.createdAt)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
