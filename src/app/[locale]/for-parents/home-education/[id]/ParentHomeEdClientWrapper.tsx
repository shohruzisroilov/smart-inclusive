"use client";

import { useRouter } from "@/i18n/navigation";
import { ArticleLayout } from "@/components/ui/ArticleLayout";
import { type ArticleView } from "@/lib/api/content";

interface ParentHomeEdClientWrapperProps {
  article: ArticleView;
}

export function ParentHomeEdClientWrapper({ article }: ParentHomeEdClientWrapperProps) {
  const router = useRouter();

  return (
    <ArticleLayout
      title={article.title}
      category={article.category}
      date={article.date}
      readingTime={article.readingTime}
      content={article.content}
      onBack={() => router.push("/for-parents/home-education")}
    />
  );
}
