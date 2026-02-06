import { BlogDetail } from "@/components/blog-detail";
import { blogService } from "@/services/blog-service";
import Link from "next/link";

export default async function PostPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const res = await blogService.getById(id);
    return <BlogDetail blog={res.data} />;
  } catch (e) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Blog tidak ditemukan
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Maaf, blog dengan ID {id} tidak dapat ditemukan.
          </p>
          <Link
            href="/posts"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Kembali ke Blog
          </Link>
        </div>
      </div>
    );
  }
}
