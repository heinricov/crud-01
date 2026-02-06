"use client";

import { Button } from "@workspace/ui/components/button";
import React from "react";

import { useEffect, useState } from "react";

interface BlogFormProps {
  onSubmit: (data: { title: string; content: string }) => void;
  onUpdate?: (id: string, data: { title: string; content: string }) => void;
  editing?: { id: string; title: string; content: string } | null;
  onCancelEdit?: () => void;
  isLoading?: boolean;
}

export function BlogForm({
  onSubmit,
  onUpdate,
  editing = null,
  onCancelEdit,
  isLoading = false
}: BlogFormProps) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [content, setContent] = useState(editing?.content ?? "");

  useEffect(() => {
    setTitle(editing?.title ?? "");
    setContent(editing?.content ?? "");
  }, [editing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Judul dan content tidak boleh kosong");
      return;
    }

    if (editing && onUpdate) {
      onUpdate(editing.id, { title, content });
      if (onCancelEdit) onCancelEdit();
    } else {
      onSubmit({ title, content });
    }
    setTitle("");
    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-lg p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground">
          {editing ? "Edit Blog" : "Buat Blog Baru"}
        </h3>
        {editing && onCancelEdit && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setTitle("");
              setContent("");
              onCancelEdit();
            }}
            disabled={isLoading}
          >
            Batal Edit
          </Button>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Judul
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masukkan judul blog..."
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading}
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Konten
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Masukkan konten blog..."
          rows={6}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading
          ? "Menyimpan..."
          : editing
            ? "Simpan Perubahan"
            : "Simpan Blog"}
      </Button>
    </form>
  );
}
