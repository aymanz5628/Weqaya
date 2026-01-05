'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/home/Hero';
import ParallaxArticleCard from '@/components/shared/ParallaxArticleCard';
import GallerySection from '@/components/home/GallerySection';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

const STRAPI_URL = 'https://active-success-312253e677.strapiapp.com';

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600",
    "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800",
];

const getFallbackImage = (index: number) => FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

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

const getCategoryInfo = (catField: any) => {
    if (!catField) return { name: 'عام', slug: 'general' };
    if (catField.name && catField.slug) return { name: catField.name, slug: catField.slug };
    if (catField.data?.attributes) return { name: catField.data.attributes.name, slug: catField.data.attributes.slug };
    return { name: 'عام', slug: 'general' };
};

const MOCK_PROGRAMS = [
    { id: 'p1', title: 'السوكياليزم', link: '#', image: getFallbackImage(15) },
    { id: 'p2', title: 'وعي', link: '#', image: getFallbackImage(16) },
    { id: 'p3', title: 'ثمانية أسئلة', link: '#', image: getFallbackImage(17) },
    { id: 'p4', title: 'فنجان', link: '#', image: getFallbackImage(18) },
];

const MOCK_DOCS = [
    { id: 'd1', title: 'أسرار الكون', link: '#', image: getFallbackImage(25) },
    { id: 'd2', title: 'الحياة البرية', link: '#', image: getFallbackImage(26) },
    { id: 'd3', title: 'تاريخنا', link: '#', image: getFallbackImage(27) },
    { id: 'd4', title: 'علوم المستقبل', link: '#', image: getFallbackImage(28) },
];

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<any[]>([]);
    const [programs, setPrograms] = useState<any[]>(MOCK_PROGRAMS);
    const [documentaries, setDocumentaries] = useState<any[]>(MOCK_DOCS);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const articlesRes = await fetch(`${STRAPI_URL}/api/articles?populate=*&sort=publishedAt:desc&pagination[limit]=20`);
                if (articlesRes.ok) {
                    const data = await articlesRes.json();
                    const rawArticles = data.data || [];
                    const formattedArticles = rawArticles.map((article: any, index: number) => {
                        const attr = article.attributes || article;
                        const cat = getCategoryInfo(attr.category);
                        const imageUrl = getStrapiMedia(getImageUrl(attr.image)) || getFallbackImage(index);
                        return {
                            id: article.id,
                            slug: attr.slug || 'article-' + article.id,
                            title: attr.title || 'بدون عنوان',
                            excerpt: attr.description || '',
                            image: imageUrl,
                            category: cat,
                            date: attr.publishedAt ? new Date(attr.publishedAt).toLocaleDateString('ar-SA') : 'تاريخ غير متوفر',
                            author: { name: 'محرر', avatar: 'https://ui-avatars.com/api/?name=User' }
                        };
                    });
                    setArticles(formattedArticles);
                }

                const programsRes = await fetch(`${STRAPI_URL}/api/programs?populate=*&pagination[limit]=4&sort=publishedAt:desc`);
                if (programsRes.ok) {
                    const data = await programsRes.json();
                    const rawPrograms = data.data || [];
                    if (rawPrograms.length > 0) {
                        const formattedPrograms = rawPrograms.map((item: any, idx: number) => {
                            const attr = item.attributes || item;
                            const imageUrl = getStrapiMedia(getImageUrl(attr.image)) || getFallbackImage(idx + 10);
                            return { id: item.id, title: attr.title || 'بدون عنوان', image: imageUrl, link: `/articles/${attr.slug || 'program-' + item.id}` };
                        });
                        setPrograms(formattedPrograms.length >= 4 ? formattedPrograms : [...formattedPrograms, ...MOCK_PROGRAMS.slice(formattedPrograms.length)]);
                    }
                }

                const docsRes = await fetch(`${STRAPI_URL}/api/documentaries?populate=*&pagination[limit]=4&sort=publishedAt:desc`);
                if (docsRes.ok) {
                    const data = await docsRes.json();
                    const rawDocs = data.data || [];
                    if (rawDocs.length > 0) {
                        const formattedDocs = rawDocs.map((item: any, idx: number) => {
                            const attr = item.attributes || item;
                            const imageUrl = getStrapiMedia(getImageUrl(attr.image)) || getFallbackImage(idx + 20);
                            return { id: item.id, title: attr.title || 'بدون عنوان', image: imageUrl, link: `/articles/${attr.slug || 'doc-' + item.id}` };
                        });
                        setDocumentaries(formattedDocs.length >= 4 ? formattedDocs : [...formattedDocs, ...MOCK_DOCS.slice(formattedDocs.length)]);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fillWithReal = (target: any[], sourceDetails: any[], count: number, suffix: string) => {
        let filled = [...target];
        if (filled.length >= count) return filled.slice(0, count);
        if (sourceDetails.length === 0) return filled;
        let i = 0;
        while (filled.length < count) {
            const original = sourceDetails[i % sourceDetails.length];
            filled.push({ ...original, id: `${original.id}-${suffix}-${filled.length}` });
            i++;
        }
        return filled;
    };

    const fillMock = (current: any[], count: number, offset: number) => {
        if (current.length >= count) return current;
        const needed = count - current.length;
        return [...current, ...Array(needed).fill(null).map((_, i) => ({
            id: `mock-feed-${offset + i}`, title: 'عنوان تجريبي للمقال', excerpt: 'نبذة مختصرة عن المقال...',
            slug: 'sample-article', image: getFallbackImage(offset + i), category: { name: 'تصنيف', slug: 'category' },
            author: { name: 'محرر', avatar: '' }, date: '2025/01/01'
        }))];
    };

    const heroArticles = articles.slice(0, 1);
    let latestTopics = fillWithReal(articles.slice(1, 5), articles, 4, 'latest');
    let mostViewed = fillWithReal(articles.slice(5, 9), [...articles].reverse(), 4, 'popular');
    const finalLatest = fillMock(latestTopics, 4, 30);
    const finalMostViewed = fillMock(mostViewed, 4, 40);

    if (loading) {
        return (
            <main className={styles.main}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                        <p style={{ fontSize: '18px', color: '#666' }}>جاري تحميل المحتوى...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.heroSection}><Hero articles={heroArticles} /></div>
            <section className={styles.parallaxSection}>
                <div className="container">
                    <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>أحدث المواضيع</h2></div>
                    <div className={styles.parallaxGrid}>
                        {finalLatest.map((article: any) => (<div key={article.id} className={styles.parallaxCardWrapper}><ParallaxArticleCard {...article} /></div>))}
                    </div>
                </div>
            </section>
            <section className={styles.parallaxSection}>
                <div className="container">
                    <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>الأكثر مشاهدة</h2></div>
                    <div className={styles.parallaxGrid}>
                        {finalMostViewed.map((article: any) => (<div key={article.id} className={styles.parallaxCardWrapper}><ParallaxArticleCard {...article} /></div>))}
                    </div>
                </div>
            </section>
            <GallerySection />
            <section id="programs" className={styles.seriesSection}>
                <div className="container">
                    <div className={styles.seriesHeader}><h2 className={styles.seriesTitle}>البرامج</h2></div>
                    <div className={styles.seriesGrid}>
                        {programs.map((item: any) => (
                            <Link href={item.link} key={item.id} className={styles.seriesCard}>
                                <Image src={item.image} alt={item.title} fill className={styles.seriesImage} />
                                <div className={styles.seriesOverlay} />
                                <div className={styles.playIcon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section id="documentaries" className={styles.seriesSection}>
                <div className="container">
                    <div className={styles.seriesHeader}><h2 className={styles.seriesTitle}>الوثائقيات</h2></div>
                    <div className={styles.seriesGrid}>
                        {documentaries.map((item: any) => (
                            <Link href={item.link} key={item.id} className={styles.seriesCard}>
                                <Image src={item.image} alt={item.title} fill className={styles.seriesImage} />
                                <div className={styles.seriesOverlay} />
                                <div className={styles.playIcon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
