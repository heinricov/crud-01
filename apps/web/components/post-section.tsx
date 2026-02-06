"use client";

import { useEffect, useState } from "react";
import { BlogForm } from "./blog-form";
import { BlogTable } from "./blog-table";
import { blogService, type Blog } from "../services/blog-service";
import { Button } from "@workspace/ui/components/button";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface PostSectionProps {
  initialPosts?: BlogPost[];
}

export function PostSection({ initialPosts = [] }: PostSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const mapToView = (b: Blog): BlogPost => ({
    id: String(b.id),
    title: b.title,
    content: b.content,
    date: new Date(b.createdAt).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  });

  useEffect(() => {
    setIsLoading(true);
    blogService
      .getAll()
      .then((res) => {
        setPosts(res.data.map(mapToView));
      })
      .catch((e) => {
        setError(e.message ?? "Gagal memuat data");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddPost = async (data: { title: string; content: string }) => {
    setIsLoading(true);
    try {
      const res = await blogService.create({
        title: data.title,
        content: data.content
      });
      setPosts([mapToView(res.data), ...posts]);
      alert("Blog berhasil ditambahkan!");
    } catch (error) {
      alert("Gagal menambahkan blog");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = (id: string) => {
    setIsLoading(true);
    blogService
      .deleteById(Number(id))
      .then(() => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      })
      .catch((e) => {
        alert("Gagal menghapus blog");
        console.error(e);
      })
      .finally(() => setIsLoading(false));
  };

  const handleEditPost = (post: BlogPost) => {
    setEditing(post);
  };

  const handleUpdatePost = (
    id: string,
    data: { title: string; content: string }
  ) => {
    setIsLoading(true);
    blogService
      .update(Number(id), data)
      .then((res) => {
        const updated = mapToView(res.data);
        setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        setEditing(null);
        alert("Blog berhasil diperbarui!");
      })
      .catch((e) => {
        alert("Gagal memperbarui blog");
        console.error(e);
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteAll = () => {
    if (!confirm("Anda yakin ingin menghapus semua blog?")) return;
    setIsLoading(true);
    blogService
      .deleteAll()
      .then(() => {
        setPosts([]);
        alert("Semua blog berhasil dihapus!");
      })
      .catch((e) => {
        alert("Gagal menghapus semua blog");
        console.error(e);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-12">
          Kelola Blog
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <BlogForm
              onSubmit={handleAddPost}
              onUpdate={handleUpdatePost}
              editing={
                editing
                  ? {
                      id: editing.id,
                      title: editing.title,
                      content: editing.content
                    }
                  : null
              }
              onCancelEdit={() => setEditing(null)}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                {error ? `Error: ${error}` : ""}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAll}
                  disabled={isLoading}
                >
                  Hapus Semua
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLoading(true);
                    blogService
                      .getAll()
                      .then((res) => setPosts(res.data.map(mapToView)))
                      .finally(() => setIsLoading(false));
                  }}
                  disabled={isLoading}
                >
                  Muat Ulang
                </Button>
              </div>
            </div>
            <BlogTable
              posts={posts}
              onDelete={handleDeletePost}
              onEdit={handleEditPost}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
