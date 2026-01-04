import Image from 'next/image';
import Link from 'next/link';
import styles from './RelatedArticles.module.css';
import { articles } from '@/lib/data';

export default function RelatedArticles() {
  const related = articles.slice(0, 3);

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>اقرأ أيضاً</h3>
      <div className={styles.list}>
        {related.map(article => (
          <Link href={`/articles/${article.id}`} key={article.id} className={styles.item}>
             <div className={styles.content}>
               <span className={styles.category}>{article.category}</span>
               <h4 className={styles.title}>{article.title}</h4>
             </div>
             <div className={styles.imageWrapper}>
               <Image src={article.image} alt={article.title} fill className={styles.image} />
             </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
