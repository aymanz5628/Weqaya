"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fetchAPI, getStrapiMedia } from '@/lib/strapi';
import styles from './page.module.css';

interface GalleryItem {
    id: number;
    attributes: {
        caption: string;
        image: {
            data: {
                attributes: {
                    url: string;
                };
            };
        };
    };
}

export default function GalleryPage() {
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadGallery() {
            try {
                const res = await fetchAPI('/gallery-images', { populate: '*' });

                let data = [];
                if (Array.isArray(res)) {
                    data = res;
                } else if (res?.data) {
                    data = res.data;
                }

                if (data && data.length > 0) {
                    const mappedPhotos = data.map((item: any) => {
                        const img = item.image || item.attributes?.image;
                        const imgData = img?.data || img;
                        const url = imgData?.attributes?.url || imgData?.url;
                        return {
                            id: item.id,
                            src: getStrapiMedia(url),
                            caption: item.caption || item.attributes?.caption || "",
                            photographer: ""
                        };
                    }).filter((photo: any) => photo.src);

                    setPhotos(mappedPhotos);
                }
            } catch (error) {
                console.error("Failed to load gallery:", error);
            } finally {
                setLoading(false);
            }
        }
        loadGallery();
    }, []);

    return (
        <main className={styles.main}>
            <div className="container">
                <header className={styles.header}>
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        المعرض الفني
                    </motion.h1>
                    <motion.p
                        className={styles.description}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        استكشف مجموعة مختارة من الأعمال الفنية والصور الفوتوغرافية التي تلهم الإبداع.
                    </motion.p>
                </header>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
                ) : (
                    <motion.div
                        className={styles.grid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {photos.length > 0 ? (
                            photos.map((photo, index) => (
                                <motion.div
                                    key={photo.id}
                                    className={styles.card}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={photo.src}
                                            alt={photo.caption}
                                            fill
                                            className={styles.image}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            unoptimized
                                        />
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.caption}>{photo.caption}</div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '20px' }}>
                                لا توجد صور في المعرض حالياً
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </main>
    );
}
