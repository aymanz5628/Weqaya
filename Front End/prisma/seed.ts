import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.article.deleteMany()
  await prisma.author.deleteMany()

  const author = await prisma.author.create({
    data: {
      name: 'فيصل السيف',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      role: 'محرر تقني'
    }
  })

  // 1. Featured / Hero content
  await prisma.article.create({
    data: {
      title: 'روائع الفنون الإسلامية: رحلة عبر الزمن',
      slug: 'islamic-art-journey',
      excerpt: 'استكشاف الجماليات الهندسية والزخارف النباتية التي ميزت العصر الذهبي.',
      content: 'محتوى تجريبي للمقال...',
      image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=1600&h=900&fit=crop',
      category: 'فنون وتاريخ',
      date: '2024-03-24',
      authorId: author.id,
      seoTitle: 'الفنون الإسلامية: تاريخ وجمال', 
      seoDescription: 'رحلة بصرية في تاريخ الفنون الإسلامية.',
    }
  })

  // 2. Modern Tech
  await prisma.article.create({
    data: {
      title: 'الذكاء الاصطناعي التوليدي: حدود الإبداع',
      slug: 'generative-ai-creativity',
      excerpt: 'هل يمكن للآلة أن تكون فنانة مبدعة؟ نقاش حول مستقبل الفن الرقمي.',
      content: 'محتوى تجريبي للمقال...',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=800&fit=crop',
      category: 'ذكاء اصطناعي',
      date: '2024-03-22',
      authorId: author.id,
      seoTitle: 'الذكاء الاصطناعي والإبداع الفني',
      seoDescription: 'كيف يغير الذكاء الاصطناعي عالم الفن.',
    }
  })

  // 3. Culture
  await prisma.article.create({
    data: {
       title: 'القهوة العربية: ضيافة وتراث عالمي',
       slug: 'arabic-coffee-heritage',
       excerpt: 'قصة القهوة في شبه الجزيرة العربية ومكانتها في قائمة التراث العالمي.',
       content: 'محتوى تجريبي للمقال...',
       image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&h=800&fit=crop',
       category: 'تراث ثقافي',
       date: '2024-03-20',
       authorId: author.id,
       seoTitle: 'القهوة العربية تراث عالمي',
       seoDescription: 'تاريخ وتقاليد القهوة العربية.',
    }
  })

  // 4. Architecture
  await prisma.article.create({
    data: {
       title: 'العمارة النجدية: انسجام الإنسان والطبيعة',
       slug: 'najdi-architecture',
       excerpt: 'كيف استطاع البناء بالطين أن يتحدى ظروف الصحراء ويخلق بيئة مستدامة.',
       content: 'محتوى تجريبي للمقال...',
       image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=800&fit=crop', // Replaced with a desert architecture vibe
       category: 'عمارة',
       date: '2024-03-18',
       authorId: author.id,
       seoTitle: 'جماليات العمارة النجدية',
       seoDescription: 'خصائص وتاريخ العمارة في نجد.',
    }
  })

  // 5. Future Work
  await prisma.article.create({
    data: {
       title: 'مستقبل العمل: مكاتب بلا جدران',
       slug: 'future-of-work',
       excerpt: 'تحولات بيئة العمل الحديثة وتأثيرها على الصحة النفسية والإنتاجية.',
       content: 'محتوى تجريبي...',
       image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=800&fit=crop',
       category: 'أعمال',
       date: '2024-03-15',
       authorId: author.id,
       seoTitle: 'مستقبل بيئات العمل',
       seoDescription: 'كيف ستكون مكاتب المستقبل؟',
    }
  })

  // 6. Space
  await prisma.article.create({
    data: {
       title: 'استكشاف المريخ: الحلم البشري القادم',
       slug: 'mars-exploration',
       excerpt: 'أحدث الاكتشافات العلمية في الكوكب الأحمر وخطط الاستعمار القادمة.',
       content: 'محتوى تجريبي...',
       image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop',
       category: 'فضاء',
       date: '2024-03-12',
       authorId: author.id,
       seoTitle: 'رحلة إلى المريخ',
       seoDescription: 'كل ما تريد معرفته عن استكشاف المريخ.',
    }
  })

  // 7. Psychology
  await prisma.article.create({
    data: {
       title: 'سيكولوجية الألوان في السينما',
       slug: 'color-psychology-cinema',
       excerpt: 'كيف يستخدم المخرجون الألوان للتلاعب بمشاعر المشاهدين وسرد القصص.',
       content: 'محتوى تجريبي...',
       image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=800&fit=crop',
       category: 'سينما',
       date: '2024-03-10',
       authorId: author.id,
       seoTitle: 'الألوان في الأفلام',
       seoDescription: 'تحليل نفسي لاستخدام الألوان في السينما.',
    }
  })

  // 8. Nature
  await prisma.article.create({
    data: {
       title: 'غموض المحيطات: العالم غير المكتشف',
       slug: 'ocean-mysteries',
       excerpt: 'الغوص في أعماق البحار واكتشاف مخلوقات وعوالم لم ترها عين بشرية من قبل.',
       content: 'محتوى تجريبي...',
       image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&h=800&fit=crop',
       category: 'طبيعة',
       date: '2024-03-08',
       authorId: author.id,
       seoTitle: 'أسرار المحيطات',
       seoDescription: 'ماذا يخبئ لنا قاع المحيط؟',
    }
  })
  
  console.log('Database seeded with 8 immersive articles')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
