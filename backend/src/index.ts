import type { Core } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';
import https from 'https';
import crypto from 'crypto';

// Articles Data with RICH Content & NEW SECTIONS
const articles = [
    {
        title: "لماذا يجب عليك الاهتمام بصحتك النفسية؟",
        description: "الصحة النفسية هي جزء لا يتجزأ من صحتك العامة، وتؤثر على طريقة تفكيرك وشعورك وتصرفاتك.",
        content: `<p>الصحة النفسية ضرورية لرفاهية الإنسان...</p>`,
        imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&q=80&w=800",
        category: "صحة",
        categorySlug: "health",
        date: "2025-12-27", slug: "mental-health-importance",
        keywords: "صحة نفسية, وقاية, حياة صحية"
    },
    {
        title: "مستقبل الذكاء الاصطناعي في التعليم",
        description: "كيف سيغير الذكاء الاصطناعي الطريقة التي نتعلم بها؟ وما هي التحديات التي تواجهنا؟",
        content: `<p>الذكاء الاصطناعي يحدث ثورة في التعليم...</p>`,
        imageUrl: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=800",
        category: "تقنية",
        categorySlug: "technology",
        date: "2025-12-26", slug: "ai-in-education",
        keywords: "ذكاء اصطناعي, تعليم, تقنية"
    },
    {
        title: "برنامج وقاية للياقة البدنية",
        description: "برنامج شامل لتحسين لياقتك البدنية خلال 30 يوماً مع مدربين معتمدين.",
        content: `
      <h2>عن البرنامج</h2>
      <p>صمم هذا البرنامج ليناسب جميع المستويات، من المبتدئين إلى المحترفين. يركز على تمارين القوة، والتحمل، والمرونة.</p>
      <h3>ماذا ستتعلم؟</h3>
      <ul>
        <li>أساسيات التغذية السليمة.</li>
        <li>تمارين منزلية فعالة بدون معدات.</li>
        <li>كيفية بناء جدول تدريبي يناسب وقتك.</li>
      </ul>
      <p>انضم إلينا اليوم وابدأ رحلة التغيير.</p>
    `,
        imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800",
        category: "برامج",
        categorySlug: "programs",
        author: { name: "سارة اللياقة", avatar: "https://ui-avatars.com/api/?name=Sara+Fit" },
        slug: "weqaya-fitness-program",
        publishedAt: new Date("2025-12-25"),
        seoTitle: "برنامج اللياقة - وقاية",
        seoDescription: "انضم لبرنامج وقاية للياقة البدنية.",
        keywords: "برامج, لياقة, رياضة, تدريب"
    },
    {
        title: "أسرار النوم العميق",
        description: "فيلم وثائقي يستكشف علم النوم وكيف يؤثر على صحتنا العقلية والجسدية.",
        content: `
      <h2>رحلة إلى عالم الأحلام</h2>
      <p>نقضي ثلث حياتنا نائمين، ومع ذلك، لا يزال النوم لغزاً يحير العلماء. في هذا الوثائقي، نسافر حول العالم لمقابلة خبراء النوم والمرضى الذين يعانون من اضطرابات نادرة.</p>
      <h3>الحقائق العلمية</h3>
      <p>يكشف الفيلم عن أحدث الأبحاث التي تربط بين قلة النوم وأمراض مثل الزهايمر والسكري. كما يقدم نصائح عملية لتحسين جودة نومك بدءاً من الليلة.</p>
    `,
        imageUrl: "https://picsum.photos/seed/sleep/800/600",
        category: "وثائقيات",
        categorySlug: "documentaries",
        author: { name: "فريق التوثيق", avatar: "https://ui-avatars.com/api/?name=Doc+Team" },
        slug: "deep-sleep-documentary",
        publishedAt: new Date("2025-12-24"),
        seoTitle: "أسرار النوم - وثائقي",
        seoDescription: "شاهد وثائقي أسرار النوم العميق حصرياً على وقاية.",
        keywords: "وثائقيات, نوم, صحة, علم"
    },
    // NEW ARTICLES
    {
        title: "رحلة إلى المريخ: الحلم يصبح حقيقة",
        description: "نظرة عميقة على جهود البشرية لاستعمار الكوكب الأحمر وأحدث التقنيات المستخدمة.",
        content: `
      <h2>الكوكب الأحمر</h2>
      <p>لطالما أسر المريخ خيالنا. الآن، بفضل التطور التكنولوجي، أصبح الوصول إليه أقرب من أي وقت مضى.</p>
      <p>تتنافس وكالات الفضاء والشركات الخاصة لإرسال أول إنسان إلى المريخ.</p>
    `,
        imageUrl: "https://picsum.photos/seed/mars/800/600",
        category: "علوم",
        categorySlug: "science",
        slug: "journey-to-mars",
        publishedAt: new Date("2025-12-20"),
        keywords: "فضاء, مريخ, علوم"
    },
    {
        title: "فنون عصر النهضة وتأثيرها",
        description: "كيف شكلت الفنون في عصر النهضة الثقافة الحديثة ومفهوم الجمال.",
        content: `
      <h2>عصر الإبداع</h2>
      <p>شهد عصر النهضة انفجاراً في الإبداع الفني والعلمي. فنانون مثل دافنشي ومايكل أنجلو غيروا وجه الفن للأبد.</p>
    `,
        imageUrl: "https://picsum.photos/seed/art/800/600",
        category: "فن",
        categorySlug: "art",
        slug: "renaissance-art",
        publishedAt: new Date("2025-12-19"),
        keywords: "فن, تاريخ, ثقافة"
    },
    {
        title: "جواهر البحر الأحمر",
        description: "اكتشف الحياة البحرية المذهلة والشعاب المرجانية الفريدة في البحر الأحمر.",
        content: `
      <h2>عالم تحت الماء</h2>
      <p>البحر الأحمر هو موطن لآلاف الأنواع من الأسماك والشعاب المرجانية التي لا توجد في أي مكان آخر.</p>
    `,
        imageUrl: "https://picsum.photos/seed/sea/800/600",
        category: "سفر",
        categorySlug: "travel",
        slug: "red-sea-gems",
        publishedAt: new Date("2025-12-18"),
        keywords: "سفر, بحر, طبيعة"
    },
    {
        title: "السيارات الكهربائية: ثورة النقل",
        description: "كيف تغير السيارات الكهربائية مستقبل التنقل وتحافظ على البيئة.",
        content: `
      <h2>مستقبل نظيف</h2>
      <p>مع تزايد الاهتمام بالبيئة، أصبحت السيارات الكهربائية الحل الأمثل للتنقل المستدام.</p>
    `,
        imageUrl: "https://picsum.photos/seed/car/800/600",
        category: "تقنية",
        categorySlug: "technology",
        slug: "electric-cars-future",
        publishedAt: new Date("2025-12-17"),
        keywords: "تقنية, سيارات, بيئة"
    },
    {
        title: "تأثير الموسيقى على الدماغ",
        description: "دراسات حديثة تكشف كيف تؤثر الموسيقى على مشاعرنا وقدراتنا العقلية.",
        content: `
      <h2>لغة العقل</h2>
      <p>الموسيقى ليست مجرد ترفيه، بل هي أداة قوية يمكنها تحسين الذاكرة وتقليل التوتر.</p>
    `,
        imageUrl: "https://picsum.photos/seed/music/800/600",
        category: "علوم",
        categorySlug: "science",
        slug: "music-and-brain",
        publishedAt: new Date("2025-12-16"),
        keywords: "موسيقى, علم نفس, صحة"
    },
    {
        title: "أشهى الأطباق الصحية",
        description: "وصفات لذيذة وصحية يمكنك تحضيرها في المنزل بأقل التكاليف.",
        content: `
      <h2>طعم الصحة</h2>
      <p>الأكل الصحي لا يعني التخلي عن الطعم اللذيذ. إليك مجموعة من الوصفات الرائعة.</p>
    `,
        imageUrl: "https://picsum.photos/seed/food/800/600",
        category: "صحة",
        categorySlug: "health",
        slug: "healthy-dishes",
        publishedAt: new Date("2025-12-15"),
        keywords: "طبخ, صحة, وصفات"
    }
];

// Enhanced Image Downloader with Status Check and Redirection Handling
async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        const request = https.get(url, (response) => {
            // Handle redirects (Picsum redirects)
            if (response.statusCode === 301 || response.statusCode === 302) {
                file.close();
                fs.unlink(filepath, () => { });
                // Recursive call for redirect
                downloadImage(response.headers.location, filepath)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                console.error(`Status code ${response.statusCode} for ${url}`); // Added logging
                file.close();
                fs.unlink(filepath, () => { });
                reject(new Error(`Failed to download image: Status Code ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve(filepath));
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

async function rawDbUpload(strapi, url, filenameBase) {
    try {
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
        const hash = crypto.randomBytes(16).toString('hex');
        const filename = `${filenameBase}_${hash}.jpg`;
        const filePath = path.join(uploadsDir, filename);
        await downloadImage(url, filePath);
        const stats = fs.statSync(filePath);
        const fileData = {
            name: `${filenameBase}.jpg`,
            alternative_text: filenameBase,
            caption: filenameBase,
            width: 600, height: 400, formats: JSON.stringify({}), hash: hash, ext: '.jpg', mime: 'image/jpeg',
            size: stats.size / 1000, url: `/uploads/${filename}`, provider: 'local', folder_path: '/',
            created_at: new Date(), updated_at: new Date(), published_at: new Date()
        };
        const result = await strapi.db.connection('files').insert(fileData).returning('id');
        return Array.isArray(result) ? (typeof result[0] === 'object' ? result[0].id : result[0]) : result;
    } catch (e) { console.error('Raw DB Upload Failed:', e); return null; }
}

async function setPublicPermissions(strapi) {
    try {
        const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
        if (!publicRole) return;
        const requiredActions = [
            'api::article.article.find', 'api::article.article.findOne',
            'api::category.category.find', 'api::category.category.findOne',
            'api::author.author.find', 'api::author.author.findOne',
            'api::gallery-image.gallery-image.find', 'api::gallery-image.gallery-image.findOne'
        ];
        for (const action of requiredActions) {
            await strapi.query('plugin::users-permissions.permission').create({ data: { action, role: publicRole.id } }).catch(() => { });
        }
    } catch (e) { }
}

export default {
    register() { },
    async bootstrap({ strapi }: { strapi: Core.Strapi }) {
        console.log('🚀 Starting Weqaya Bootstrap (Content Update)...');

        // ONE-TIME ADMIN RESET FOR RENDER DEPLOYMENT
        if (process.env.RESET_ADMIN === 'true') {
            console.log('🔄 Resetting admin users for fresh registration...');
            try {
                await strapi.db.query('admin::user').deleteMany({});
                console.log('✅ Admin users cleared. You can now register a new admin.');
            } catch (err) {
                console.error('Failed to reset admin users:', err);
            }
        }

        try {
            await setPublicPermissions(strapi);

            for (const article of articles) {
                try {
                    // Find existing Category
                    let category = await strapi.entityService.findMany('api::category.category', {
                        filters: { slug: article.categorySlug },
                        limit: 1
                    });

                    let categoryId;
                    if (category && category.length > 0) {
                        categoryId = category[0].id;
                    } else {
                        console.log(`Creating category: ${article.category}`);
                        const newCat = await strapi.entityService.create('api::category.category', {
                            data: { name: article.category, slug: article.categorySlug, publishedAt: new Date() }
                        });
                        categoryId = newCat.id;
                    }

                    // Check if article exists
                    const existing = await strapi.entityService.findMany('api::article.article', {
                        filters: { slug: article.slug },
                        limit: 1,
                        populate: ['image']
                    });

                    if (existing && existing.length > 0) {
                        const currentArticle: any = existing[0];
                        // UPDATE: Check if image is missing and we have one to upload
                        if (!currentArticle.image && article.imageUrl) {
                             console.log(`🔄 Updating image for existing article: ${article.title}`);
                             try {
                                 const imageId = await rawDbUpload(strapi, article.imageUrl, article.slug);
                                 if (imageId) {
                                     await strapi.entityService.update('api::article.article', currentArticle.id, {
                                         data: { image: imageId }
                                     });
                                     console.log(`✅ Image updated for: ${article.title}`);
                                 }
                             } catch (err) {
                                 console.error(`Failed to update image for ${article.title}:`, err);
                             }
                        }
                    } else {
                        console.log(`Creating new article: ${article.title}`);
                        let imageId = null;
                        if (article.imageUrl) {
                            try {
                                imageId = await rawDbUpload(strapi, article.imageUrl, article.slug);
                            } catch (imgErr) {
                                console.error('Failed to upload image:', imgErr);
                            }
                        }

                        // Create Author if needed
                        let authorId = null;
                        if (article.author) {
                            const authors = await strapi.entityService.findMany('api::author.author', { filters: { name: article.author.name }, limit: 1 });
                            if (authors.length > 0) authorId = authors[0].id;
                            else {
                                const newAuth = await strapi.entityService.create('api::author.author', {
                                    data: { name: article.author.name, bio: "Expert writer", publishedAt: new Date() }
                                });
                                authorId = newAuth.id;
                                const authAva = await rawDbUpload(strapi, article.author.avatar, `auth_${authorId}`);
                                if (authAva) await strapi.entityService.update('api::author.author', authorId, { data: { avatar: authAva } });
                            }
                        }

                        await strapi.entityService.create('api::article.article', {
                            data: {
                                title: article.title,
                                description: article.description,
                                content: article.content || '<p>Content coming soon.</p>',
                                slug: article.slug,
                                image: imageId,
                                category: categoryId,
                                author: authorId,
                                publishedAt: article.publishedAt || new Date(),
                                seoTitle: article.seoTitle || article.title,
                                seoDescription: article.seoDescription || article.description,
                                keywords: article.keywords || ''
                            }
                        });
                        console.log(`✨ Created article: ${article.title}`);
                    }
                } catch (innerError) {
                    console.error(`Failed processing article ${article.title}:`, innerError);
                }
            }
        } catch (error) {
            console.error('Bootstrap Critical Error:', error);
        }
        console.log('🎉 Bootstrap Complete!');
    },
};
