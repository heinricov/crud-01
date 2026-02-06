"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card";

interface BlogCardProps {
  title: string;
  content: string;
  date: string;
}

export function BlogCard({ title, content, date }: BlogCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">{date}</p>
      </CardHeader>
      <CardContent className="grow">
        <p className="text-sm text-foreground line-clamp-3">{content}</p>
      </CardContent>
    </Card>
  );
}
