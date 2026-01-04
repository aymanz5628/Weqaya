'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Save, Loader2 } from 'lucide-react'
import styles from './ArticleForm.module.css'

type Author = {
  id: string
  name: string
}

type Article = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: string
  date: string
  authorId: string
  seoTitle?: string | null
  seoDescription?: string | null
  canonicalUrl?: string | null
}

type Props = {
  authors: Author[]
  article?: Article
  action: (formData: FormData) => Promise<void>
}

export default function ArticleForm({ authors, article, action }: Props) {
  const [isPending, setIsPending] = useState(false)
  
  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    try {
      await action(formData)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={styles.formContainer}>
       <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Link href="/admin/articles" className={styles.backLink}>
            <ArrowRight size={20} />
          </Link>
          <h1 className={styles.title}>{article ? 'تعديل المقال' : 'مقال جديد'}</h1>
        </div>
      </div>

      <form action={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>عنوان المقال</label>
            <input 
              name="title" 
              defaultValue={article?.title} 
              required 
              className={styles.input} 
              placeholder="مثال: كيف تبدأ في عالم البرمجة؟"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>التصنيف</label>
            <input 
              name="category" 
              defaultValue={article?.category} 
              required 
              className={styles.input}
              placeholder="مثال: تقنية، صحة..." 
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>الكاتب</label>
            <select 
              name="authorId" 
              defaultValue={article?.authorId} 
              required 
              className={styles.select}
            >
              <option value="">اختر الكاتب</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>تاريخ النشر</label>
            <input 
              name="date" 
              type="date"
              defaultValue={article?.date} 
              required 
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>رابط الصورة</label>
          <input 
            name="image" 
            defaultValue={article?.image} 
            required 
            className={styles.input}
            placeholder="https://..."
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>مقتطف قصير (للعرض في القائمة)</label>
          <textarea 
            name="excerpt" 
            defaultValue={article?.excerpt} 
            required 
            rows={2}
            className={styles.textarea}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>محتوى المقال</label>
          <textarea 
            name="content" 
            defaultValue={article?.content} 
            required 
            rows={10}
            className={styles.textarea}
          />
        </div>
        
        <div className={styles.divider} style={{borderTop: '1px solid #e2e8f0', margin: '24px 0'}}></div>
        
        <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '16px'}}>تحسين محركات البحث (SEO)</h3>
        
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>رابط المقال (Slug)</label>
            <input 
              name="slug" 
              defaultValue={article?.slug} 
              required 
              className={styles.input}
              placeholder="example-article-url" 
            />
          </div>
          
          <div className={styles.field}>
            <label className={styles.label}>عنوان SEO</label>
            <input 
              name="seoTitle" 
              defaultValue={article?.seoTitle || ''} 
              className={styles.input}
              placeholder="الظاهر في نتائج البحث" 
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>رابط Canonical</label>
            <input 
              name="canonicalUrl" 
              defaultValue={article?.canonicalUrl || ''} 
              className={styles.input}
              placeholder="https://..." 
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>وصف SEO</label>
          <textarea 
            name="seoDescription" 
            defaultValue={article?.seoDescription || ''} 
            rows={3}
            className={styles.textarea}
            placeholder="وصف مختصر يظهر تحت العنوان في نتائج البحث"
          />
        </div>

        <div className={styles.actions}>
          <Link href="/admin/articles" className={styles.cancelBtn}>
            إلغاء
          </Link>
          <button type="submit" disabled={isPending} className={styles.submitBtn}>
            {isPending ? (
              <>
                <Loader2 size={20} className={styles.spinner} />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save size={20} />
                حفظ التغييرات
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
