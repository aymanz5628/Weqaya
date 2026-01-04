import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <p className={styles.copy}>جميع الحقوق محفوظة لـ وقاية+ للنشر والتوزيع © 2025</p>
                <div className={styles.links}>
                    <Link href="#" className={styles.link}>من نحن</Link>
                    <Link href="#" className={styles.link}>أعلن معنا</Link>
                    <Link href="#" className={styles.link}>الوظائف</Link>
                    <Link href="#" className={styles.link}>سياسة الخصوصية</Link>
                </div>
            </div>
        </footer>
    );
}
