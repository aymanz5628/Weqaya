import { fetchAPI, getStrapiMedia } from '@/lib/strapi';
import ArticleCard from '@/components/shared/ArticleCard';
import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
    const { q } = await searchParams; // Next.js 15 await params
    const query = q || '';

    let articles = [];

    if (query) {
        try {
            // Search by Title OR Description
            const res = await fetchAPI('/articles', {
                filters: {
                    $or: [
                        { title: { $containsi: query } },
                        { description: { $containsi: query } },
                        { content: { $containsi: query } }
                    ]
                },
                populate: {
                    image: true,
                    author: { populate: ['avatar'] },
                    category: true
                },
                sort: ['publishedAt:desc']
            });

            const rawArticles = res.data || [];

            articles = rawArticles.map((article: any) => {
                const attr = article.attributes || article;
                const data = attr;

                const categoryRel = data.category || data.categories;
                const categoryData = categoryRel?.data?.attributes || categoryRel?.data || categoryRel;
                const finalCategoryObj = Array.isArray(categoryData) ? categoryData[0] : categoryData;
                const catName = finalCategoryObj?.name || finalCategoryObj?.attributes?.name || '';
                const catSlug = finalCategoryObj?.slug || finalCategoryObj?.attributes?.slug || '';

                const imageRel = data.image;
                let imageUrl = getStrapiMedia(imageRel?.data?.attributes?.url || imageRel?.url || null);
                if (!imageUrl) imageUrl = "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600";

                const authorRel = data.author;
                const authorData = authorRel?.data?.attributes || authorRel?.data || authorRel;
                const authorAvatarRel = authorData?.avatar;
                const authorAvatarUrl = authorAvatarRel?.data?.attributes?.url || authorAvatarRel?.url;

                return {
                    id: article.id,
                    slug: data.slug,
                    title: data.title,
                    excerpt: data.description || '',
                    image: imageUrl,
                    category: { name: catName, slug: catSlug },
                    date: new Date(data.publishedAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
                    author: {
                        name: authorData?.name || 'محرر',
                        avatar: getStrapiMedia(authorAvatarUrl || null) || 'https://ui-avatars.com/api/?name=W&background=random'
                    }
                };
            });

        } catch (err) {
            console.error("Search fetch error:", err);
        }
    }

    return (
        <main className={styles.main}>
            {/* Header */}
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    <ArrowRight size={24} />
                </Link>
                <div className={styles.titleWrapper}>
                    <Search size={28} className={styles.icon} />
                    <h1 className={styles.pageTitle}>البحث</h1>
                </div>
            </div>

            {/* Query Display */}
            {query && (
                <p className={styles.queryStats}>
                    نتائج البحث عن: <span className={styles.queryHighlight}>{query}</span>
                </p>
            )}

            {/* Grid */}
            {articles.length > 0 ? (
                <div className={styles.grid}>
                    {articles.map((article: any) => (
                        <ArticleCard
                            key={article.id}
                            id={article.id}
                            slug={article.slug}
                            title={article.title}
                            excerpt={article.excerpt}
                            image={article.image}
                            category={article.category}
                            author={article.author}
                            date={article.date}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.noResults}>
                    {query ? (
                        <>
                            <h3 className={styles.noResultsTitle}>لا توجد نتائج مطابقة لبحثك</h3>
                            <p className={styles.noResultsText}>جرب البحث بكلمات مفتاحية مختلفة</p>
                        </>
                    ) : (
                        <h3 className={styles.noResultsTitle}>ابحث في المقالات والمواضيع</h3>
                    )}
                </div>
            )}
        </main>
    );
}
