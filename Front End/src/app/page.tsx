import Hero from '@/components/home/Hero';
import ArticleCard from '@/components/shared/ArticleCard';
import ParallaxArticleCard from '@/components/shared/ParallaxArticleCard';
import GallerySection from '@/components/home/GallerySection';
import { fetchAPI, getStrapiMedia } from '@/lib/strapi';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

const getCategoryInfo = (catField: any) => {
    if (!catField) return { name: 'عام', slug: 'general' };
    if (catField.name && catField.slug) return { name: catField.name, slug: catField.slug };
    if (catField.data?.attributes) return { name: catField.data.attributes.name, slug: catField.data.attributes.slug };
    return { name: 'عام', slug: 'general' };
};

const formatArticle = (article: any, index: number) => {
    const attr = article.attributes || article;
    const imageUrl = getStrapiMedia(getImageUrl(attr.image)) || getFallbackImage(index);
    return {
        id: article.id,
        title: attr.title || 'بدون عنوان',
        image: imageUrl,
        link: `/articles/${attr.slug}`
    };
};

const MOCK_PROGRAMS = [
    { id: 'p1', title: 'السوكياليزم', link: '#' },
    { id: 'p2', title: 'وعي', link: '#' },
    { id: 'p3', title: 'ثمانية أسئلة', link: '#' },
    { id: 'p4', title: 'فنجان', link: '#' },
];

const MOCK_DOCS = [
    { id: 'd1', title: 'أسرار الكون', link: '#' },
    { id: 'd2', title: 'الحياة البرية', link: '#' },
    { id: 'd3', title: 'تاريخنا', link: '#' },
    { id: 'd4', title: 'علوم المستقبل', link: '#' },
];

export default async function Home() {
    let mosaicArticles: any[] = [];
    try {
        // Fetch up to 20 articles to have a good pool
        const articlesRes = await fetchAPI('/articles', {
            populate: '*',
            sort: ['publishedAt:desc'],
            pagination: { limit: 20 }
        });

        const rawArticles = articlesRes.data || [];

        mosaicArticles = rawArticles.map((article: any, index: number) => {
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
    } catch (err) {
        console.error("Error fetching main articles:", err);
    }

    // Fetch Programs
    let programs: any[] = [];
    try {
        const res = await fetchAPI('/programs', {
            populate: '*',
            pagination: { limit: 4 },
            sort: ['publishedAt:desc']
        });
        programs = (res.data || []).map((item: any, idx: number) => formatArticle(item, idx + 10));
    } catch (err) { }
    if (programs.length < 4) {
        const needed = 4 - programs.length;
        const extras = MOCK_PROGRAMS.slice(0, needed).map((item, idx) => ({ ...item, id: `mock-p-${idx}`, image: getFallbackImage(idx + 15) }));
        programs = [...programs, ...extras];
    }

    // Fetch Documentaries
    let documentaries: any[] = [];
    try {
        const res = await fetchAPI('/documentaries', {
            populate: '*',
            pagination: { limit: 4 },
            sort: ['publishedAt:desc']
        });
        documentaries = (res.data || []).map((item: any, idx: number) => formatArticle(item, idx + 20));
    } catch (err) { }
    if (documentaries.length < 4) {
        const needed = 4 - documentaries.length;
        const extras = MOCK_DOCS.slice(0, needed).map((item, idx) => ({ ...item, id: `mock-d-${idx}`, image: getFallbackImage(idx + 25) }));
        documentaries = [...documentaries, ...extras];
    }

    // --- SMART CONTENT DISTRIBUTION ---

    // 1. Hero: Always single article (the latest one)
    const heroArticles = mosaicArticles.slice(0, 1);

    // Helper to recycle content securely with unique IDs
    const fillWithReal = (target: any[], sourceDetails: any[], count: number, suffix: string) => {
        let filled = [...target];
        if (filled.length >= count) return filled.slice(0, count);

        // If we have nothing to recycle, we can't help
        if (sourceDetails.length === 0) return filled;

        let i = 0;
        // Try not to repeat immediately if possible, but fallback to repeating
        // We cycle through sourceDetails
        while (filled.length < count) {
            const original = sourceDetails[i % sourceDetails.length];
            // Only add if not already in list (by original ID check)? 
            // Actually user wants content, duplicates are better than broken mocks.
            // We append a suffix to ID to ensure React keys work
            filled.push({ ...original, id: `${original.id}-${suffix}-${filled.length}` });
            i++;
        }
        return filled;
    };

    // 2. Latest Topics: Needs 4
    // Ideally use articles [1..4]
    let latestTopics = mosaicArticles.slice(1, 5);
    // Fill if missing using ALL available articles (including hero one if desperate)
    latestTopics = fillWithReal(latestTopics, mosaicArticles, 4, 'latest');

    // 3. Most Viewed: Needs 4
    // Ideally use articles [5..9], fallback to whatever we have
    // We reverse the source pool to mock "different" content order if we are recycling
    let mostViewed = mosaicArticles.slice(5, 9);
    const reversePool = [...mosaicArticles].reverse();
    mostViewed = fillWithReal(mostViewed, reversePool, 4, 'popular');


    // Fallback Mock Logic (Only runs if we have literally 0 articles from backend)
    const fillMock = (current: any[], count: number, offset: number) => {
        if (current.length >= count) return current;
        const needed = count - current.length;
        return [...current, ...Array(needed).fill(null).map((_, i) => ({
            id: `mock-feed-${offset + i}`,
            title: 'عنوان تجريبي للمقال',
            excerpt: 'نبذة مختصرة عن المقال...',
            slug: 'sample-article', // This might be a dead link, but better than crash
            image: getFallbackImage(offset + i),
            category: { name: 'تصنيف', slug: 'category' },
            author: { name: 'محرر', avatar: '' },
            date: '2025/01/01'
        }))];
    };

    const finalLatest = fillMock(latestTopics, 4, 30);
    const finalMostViewed = fillMock(mostViewed, 4, 40);

    return (
        <main className={styles.main}>
            {/* Hero now handles single article correctly internally based on updated Hero.tsx */}
            <div className={styles.heroSection}><Hero articles={heroArticles} /></div>

            {/* أحدث المواضيع - Parallax Cards Section */}
            <section className={styles.parallaxSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>أحدث المواضيع</h2>
                        {/* Link Removed */}
                    </div>
                    <div className={styles.parallaxGrid}>
                        {finalLatest.map((article: any) => (
                            <div key={article.id} className={styles.parallaxCardWrapper}>
                                <ParallaxArticleCard {...article} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* الأكثر مشاهدة - Parallax Cards Section */}
            <section className={styles.parallaxSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>الأكثر مشاهدة</h2>
                        {/* Link Removed */}
                    </div>
                    <div className={styles.parallaxGrid}>
                        {finalMostViewed.map((article: any) => (
                            <div key={article.id} className={styles.parallaxCardWrapper}>
                                <ParallaxArticleCard {...article} />
                            </div>
                        ))}
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
