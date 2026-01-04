import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const articleCount = await prisma.article.count();
  const authorCount = await prisma.author.count();

  return (
    <div>
      <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '24px'}}>لوحة التحكم</h1>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px'}}>
        <div style={{backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
          <h3 style={{color: '#64748b', fontSize: '14px', marginBottom: '8px'}}>إجمالي المقالات</h3>
          <p style={{fontSize: '32px', fontWeight: 'bold', color: '#0f172a'}}>{articleCount}</p>
        </div>
        
        <div style={{backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
          <h3 style={{color: '#64748b', fontSize: '14px', marginBottom: '8px'}}>الكُتاب</h3>
          <p style={{fontSize: '32px', fontWeight: 'bold', color: '#0f172a'}}>{authorCount}</p>
        </div>
      </div>
    </div>
  );
}
