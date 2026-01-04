import Image from 'next/image';
import styles from './ArticleBody.module.css';

interface ArticleBodyProps {
  content: string;
  image?: string;
}

// Render actual article content from Strapi
export default function ArticleBody({ content, image }: ArticleBodyProps) {
  // Check if content looks like HTML (contains tags)
  const isHtml = content && (content.includes('<') || content.includes('&lt;'));
  
  return (
    <div className={styles.body}>
      {image && (
        <div className={styles.imageWrapper}>
          <Image src={image} alt="Article Image" fill className={styles.image} />
        </div>
      )}
      
      {/* Render actual content from CMS */}
      {content && (
        isHtml ? (
          <div 
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        ) : (
          <div className={styles.content}>
            {content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph}</p>
            ))}
          </div>
        )
      )}
      
      {!content && (
        <p className={styles.noContent}>لا يوجد محتوى لهذه المقالة.</p>
      )}
    </div>
  );
}
