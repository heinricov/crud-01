import { PostSection } from "@/components/post-section";

export const metadata = {
  title: "Kelola Blog | v0 App",
  description: "Halaman untuk membuat, mengedit, dan menghapus blog posts"
};

export default function PostsPage() {
  return (
    <main className="min-h-screen bg-background">
      <PostSection />
    </main>
  );
}
