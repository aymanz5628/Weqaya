'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './Hero.module.css';

interface Article {
    id: string | number;
    slug: string;
    image: string;
    category: {
        name: string;
        slug: string;
    };
    title: string;
    excerpt: string;
    author: {
        name: string;
        avatar: string;
    };
    publishedAt: string;
}

interface HeroProps {
    articles: Article[];
}

export default function Hero({ articles }: HeroProps) {
    const containerRef = useRef<HTMLElement>(null);

    // Safe access to articles - only use the first one
    const article = articles && articles.length > 0 ? articles[0] : null;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    // Fix: Always render the section to satisfy useScroll ref requirement, even if loading
    if (!article) {
        return (
            <section ref={containerRef} className={`${styles.heroSection}`}>
                <div className={styles.heroCard} style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
                    <p style={{ color: '#888' }}>جاري تحميل المقالات المميزة...</p>
                </div>
            </section>
        );
    }

    return (
        <section ref={containerRef} className={`${styles.heroSection}`}>
            <div className={styles.heroCard}>
                <motion.div
                    className={styles.imageContainer}
                    style={{ y }}
                >
                    <motion.div
                        className="w-full h-full relative"
                        key={article.image}
                        initial={{ scale: 1.0 }}
                        animate={{ scale: 1.10 }}
                        transition={{
                            duration: 20,
                            ease: "linear",
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        style={{ width: '100%', height: '100%', willChange: 'transform' }}
                    >
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill sizes="100vw"
                            className={styles.heroImage}
                            priority
                        />
                    </motion.div>
                    {/* Overlay gradient */}
                    <div className={styles.overlay}></div>
                </motion.div>

                <div className={styles.content}>
                    <Link href={`/category/${article.category.slug}`} className={styles.categoryBadge}>
                        {article.category.name}
                    </Link>
                    <Link href={`/articles/${article.slug}`} className={styles.titleLink}>
                        <h2 className={styles.title}>{article.title}</h2>
                    </Link>
                    <p className={styles.subtitle}>{article.excerpt}</p>
                </div>
            </div>
        </section>
    );
}
