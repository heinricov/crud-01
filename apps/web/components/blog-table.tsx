"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface BlogTableProps {
  posts: BlogPost[];
  onDelete: (id: string) => void;
  onEdit: (post: BlogPost) => void;
  isLoading?: boolean;
}

export function BlogTable({
  posts,
  onDelete,
  onEdit,
  isLoading = false
}: BlogTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectAll = () => {
    if (selectedIds.size === posts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(posts.map((p) => p.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) {
      alert("Pilih minimal satu blog untuk dihapus");
      return;
    }

    if (confirm(`Anda yakin ingin menghapus ${selectedIds.size} blog?`)) {
      selectedIds.forEach((id) => onDelete(id));
      setSelectedIds(new Set());
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Anda yakin ingin menghapus blog ini?")) {
      onDelete(id);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground text-lg">
          Belum ada blog. Buat blog baru untuk memulai.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      {selectedIds.size > 0 && (
        <div className="bg-primary/10 border-b border-border p-4 flex items-center justify-between">
          <p className="text-foreground font-medium">
            {selectedIds.size} item dipilih
          </p>
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={isLoading}
            size="sm"
          >
            Hapus Pilihan
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.size === posts.length && posts.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                Judul
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                Konten
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-border hover:bg-muted/50 transition"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(post.id)}
                    onChange={() => handleSelectOne(post.id)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {post.id}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {post.title}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground line-clamp-2">
                  {post.content}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {post.date}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(post)}
                      disabled={isLoading}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      disabled={isLoading}
                    >
                      Hapus
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
