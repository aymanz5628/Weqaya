import Image from 'next/image';
import Link from 'next/link';
import styles from './ArticleHeader.module.css';

interface ArticleHeaderProps {
  title: string;
  excerpt: string;
  category: string;
  categorySlug?: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
}

export default function ArticleHeader({ title, excerpt, category, categorySlug, author, date }: ArticleHeaderProps) {
  return (
    <header className={styles.header}>
      <Link href={`/category/${categorySlug || 'health'}`} className={styles.categoryTag}>
        {category}
      </Link>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.excerpt}>{excerpt}</p>
      
      <div className={styles.meta}>
        <div style={{position: 'relative', width: 40, height: 40}}>
           <Image 
             src={author.avatar} 
             alt={author.name} 
             fill 
             className={styles.authorAvatar} 
           />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '14px'}}>
           <span className={styles.authorName}>{author.name}</span>
           <span className={styles.date}>{date}</span>
        </div>
      </div>
    </header>
  );
}
