import { notFound } from 'next/navigation';
import { fetchAPI, getStrapiMedia } from '@/lib/strapi';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleBody from '@/components/article/ArticleBody';
import type { Metadata } from 'next';

// CRITICAL: Force dynamic rendering, no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface Props {
  params: { slug: string };
}

// Helper to extract image URL from various Strapi response formats
const getImageUrl = (imageField: any): string | null => {
    if (!imageField) return null;
    if (imageField.url) return imageField.url;
    if (imageField.data?.attributes?.url) return imageField.data.attributes.url;
    if (imageField.data?.url) return imageField.data.url;
    return null;
};

async function getArticle(slug: string) {
  console.log(`[Article] Fetching article with slug: ${slug}`);
  
  const data = await fetchAPI('/articles', {
    filters: { slug: slug },
    populate: '*', // Populate ALL fields
  });
  
  const article = data?.data?.[0];
  
  if (article) {
    const attr = article.attributes || article;
    console.log(`[Article] Found: "${attr.title}"`);
    console.log(`[Article] Content length: ${attr.content?.length || 0} chars`);
    console.log(`[Article] Content preview: ${attr.content?.substring(0, 100)}...`);
  } else {
    console.log(`[Article] Not found for slug: ${slug}`);
  }
  
  return article;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const articleData = await getArticle(resolvedParams.slug);
  if (!articleData) return {};

  const article = articleData.attributes || articleData;
  const imageUrl = getStrapiMedia(getImageUrl(article.image));

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const articleData = await getArticle(resolvedParams.slug);

  if (!articleData) {
    notFound();
  }

  const article = articleData.attributes || articleData;
  const author = article.author?.data?.attributes || article.author || {};
  const category = article.category?.data?.attributes || article.category || {};
  const imageUrl = getStrapiMedia(getImageUrl(article.image));
  const avatarUrl = getStrapiMedia(getImageUrl(author?.avatar));

  return (
    <article className="min-h-screen bg-white pb-20">
      <ArticleHeader 
        title={article.title}
        excerpt={article.description}
        category={category?.name || 'عام'}
        author={{
          name: author?.name || 'محرر وقاية',
          avatar: avatarUrl || 'https://ui-avatars.com/api/?name=W'
        }}
        date={new Date(article.publishedAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
      />
      
      <ArticleBody 
        content={article.content}
        image={imageUrl || undefined}
      />
    </article>
  );
}
