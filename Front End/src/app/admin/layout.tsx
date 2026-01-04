import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.brand}>وقاية+ <span className={styles.badge}>إدارة</span></h2>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            <LayoutDashboard size={20} />
            <span>لوحة التحكم</span>
          </Link>
          <Link href="/admin/articles" className={styles.navLink}>
            <FileText size={20} />
            <span>المقالات</span>
          </Link>
          <Link href="#" className={styles.navLink}>
            <Settings size={20} />
            <span>الإعدادات</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.navLink}>
            <LogOut size={20} />
            <span>العودة للموقع</span>
          </Link>
        </div>
      </aside>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
