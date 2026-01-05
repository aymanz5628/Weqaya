'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleBody from '@/components/article/ArticleBody';

const STRAPI_URL = 'https://weqaya-376a5d5eac.strapiapp.com';

const getImageUrl = (imageField: any): string | null => {
    if (!imageField) return null;
    if (imageField.url) return imageField.url;
    if (imageField.data?.attributes?.url) return imageField.data.attributes.url;
    if (imageField.data?.url) return imageField.data.url;
    return null;
};

const getStrapiMedia = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('//')) return url;
    return `${STRAPI_URL}${url}`;
};

export default function ArticlePage() {
    const params = useParams();
    const slug = params?.slug as string;
    
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState<any>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        
        const fetchArticle = async () => {
            try {
                let url = `${STRAPI_URL}/api/articles?filters[slug]=${slug}&populate=*`;
                const isIdFallback = slug.startsWith('article-');
                
                if (isIdFallback) {
                    const idPart = slug.split('article-')[1];
                    // If it looks like an ID, try fetching by ID directly
                    if (!isNaN(Number(idPart))) {
                         url = `${STRAPI_URL}/api/articles/${idPart}?populate=*`;
                    }
                }

                const res = await fetch(url);
                
                if (res.ok) {
                    const data = await res.json();
                    let articleData = null;

                    // Handle different response structures
                    if (data.data) {
                        if (Array.isArray(data.data)) {
                            // Collection response (from filters)
                            articleData = data.data[0];
                        } else {
                            // Single entry response (from ID lookup)
                            articleData = data.data;
                        }
                    }

                    if (articleData) {
                        const attr = articleData.attributes || articleData;
                        setArticle({
                            title: attr.title || 'بدون عنوان',
                            description: attr.description || '',
                            content: attr.content || '',
                            publishedAt: attr.publishedAt,
                            image: getStrapiMedia(getImageUrl(attr.image)),
                            author: attr.author?.data?.attributes || attr.author || {},
                            category: attr.category?.data?.attributes || attr.category || {}
                        });
                    } else {
                        setNotFound(true);
                    }
                } else {
                    console.error('API Error:', res.status, res.statusText);
                    setNotFound(true);
                }
            } catch (error) {
                console.error('Error fetching article:', error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                    <p style={{ fontSize: '18px', color: '#666' }}>جاري تحميل المقال...</p>
                </div>
            </div>
        );
    }

    if (notFound || !article) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>😕</div>
                    <h1 style={{ fontSize: '24px', color: '#333' }}>المقال غير موجود</h1>
                    <p style={{ fontSize: '16px', color: '#666', marginTop: '10px' }}>عذراً، لم نتمكن من العثور على المقال المطلوب.</p>
                </div>
            </div>
        );
    }

    const avatarUrl = getStrapiMedia(getImageUrl(article.author?.avatar));

    return (
        <article className="min-h-screen bg-white pb-20">
            <ArticleHeader 
                title={article.title}
                excerpt={article.description}
                category={article.category?.name || 'عام'}
                author={{
                    name: article.author?.name || 'محرر وقاية',
                    avatar: avatarUrl || 'https://ui-avatars.com/api/?name=W'
                }}
                date={article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            />
            <ArticleBody 
                content={article.content}
                image={article.image || undefined}
            />
        </article>
    );
}
