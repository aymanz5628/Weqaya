import { fetchAPI, getStrapiMedia } from '@/lib/strapi';
import ArticleCard from '@/components/shared/ArticleCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const { slug } = await params; // Next.js 15 requires awaiting params

    // 1. Fetch Articles for this category
    let articles = [];
    let categoryName = slug;

    try {
        // Filter articles by category slug
        const res = await fetchAPI('/articles', {
            filters: {
                category: {
                    slug: {
                        $eq: slug
                    }
                }
            },
            populate: {
                image: true,
                author: {
                    populate: ['avatar']
                },
                category: true
            },
            sort: ['publishedAt:desc']
        });

        const rawArticles = res.data || [];

        // Extract Category Name from first article if available
        if (rawArticles.length > 0) {
            const catData = rawArticles[0].attributes?.category?.data || rawArticles[0].category;
            const catAttr = catData?.attributes || catData;
            if (catAttr?.name) categoryName = catAttr.name;
        } else {
            // Fallback: try to fetch category details directly if no articles
            // (Skipping for now to keep it simple, will just show slug or 'Category')
        }

        articles = rawArticles.map((article: any) => {
            const attr = article.attributes || article;
            const data = attr; // In v5 sometimes flattened

            // ... (Same mapping logic as Home Page) ...
            const categoryRel = data.category || data.categories;
            const categoryData = categoryRel?.data?.attributes || categoryRel?.data || categoryRel;
            const finalCategoryObj = Array.isArray(categoryData) ? categoryData[0] : categoryData;
            const catName = finalCategoryObj?.name || finalCategoryObj?.attributes?.name || '';
            const catSlug = finalCategoryObj?.slug || finalCategoryObj?.attributes?.slug || '';

            const imageRel = data.image;
            let imageUrl = getStrapiMedia(imageRel?.data?.attributes?.url || imageRel?.url || null);
            if (!imageUrl) imageUrl = "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600"; // Generic fallback

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
        console.error("Category fetch error:", err);
    }

    return (
        <main className="container" style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
            {/* Header */}
            <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/" style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRight size={24} color="#64748b" />
                </Link>
                <div>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>تصنيف</span>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>{categoryName}</h1>
                </div>
            </div>

            {/* Grid */}
            {articles.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
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
                <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#f8fafc', borderRadius: '1rem' }}>
                    <h3 style={{ color: '#64748b' }}>لا توجد مقالات في هذا التصنيف حالياً</h3>
                    <Link href="/" style={{ color: '#2563eb', marginTop: '1rem', display: 'inline-block' }}>
                        العودة للصفحة الرئيسية
                    </Link>
                </div>
            )}
        </main>
    );
}
