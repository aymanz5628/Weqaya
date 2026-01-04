import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { deleteArticle } from '@/app/actions/articles';

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    include: { author: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <h1 style={{fontSize: '24px', fontWeight: 'bold'}}>إدارة المقالات</h1>
        <Link 
          href="/admin/articles/new" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#000',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '8px',
            fontWeight: '500'
          }}
        >
          <Plus size={18} />
          مقال جديد
        </Link>
      </div>

      <div style={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
          <thead style={{backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
            <tr>
              <th style={{padding: '16px', fontWeight: '600', color: '#64748b'}}>العنوان</th>
              <th style={{padding: '16px', fontWeight: '600', color: '#64748b'}}>الكاتب</th>
              <th style={{padding: '16px', fontWeight: '600', color: '#64748b'}}>التصنيف</th>
              <th style={{padding: '16px', fontWeight: '600', color: '#64748b'}}>التاريخ</th>
              <th style={{padding: '16px', fontWeight: '600', color: '#64748b'}}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                <td style={{padding: '16px', fontWeight: '500', color: '#0f172a'}}>
                  <div style={{maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {article.title}
                  </div>
                </td>
                <td style={{padding: '16px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={article.author.avatar} 
                      alt={article.author.name} 
                      style={{width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover'}}
                    />
                    <span style={{fontSize: '14px'}}>{article.author.name}</span>
                  </div>
                </td>
                <td style={{padding: '16px'}}>
                  <span style={{
                    backgroundColor: '#fff7ed', 
                    color: '#c2410c', 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: '600'
                  }}>
                    {article.category}
                  </span>
                </td>
                <td style={{padding: '16px', fontSize: '14px', color: '#64748b'}}>{article.date}</td>
                <td style={{padding: '16px'}}>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <Link href={`/admin/articles/${article.id}/edit`} style={{padding: '6px', color: '#3b82f6', backgroundColor: '#eff6ff', borderRadius: '6px'}}>
                      <Edit size={16} />
                    </Link>
                    <form action={deleteArticle.bind(null, article.id)}>
                        <button type="submit" style={{padding: '6px', color: '#ef4444', backgroundColor: '#fef2f2', borderRadius: '6px', border: 'none', cursor: 'pointer'}}>
                            <Trash2 size={16} />
                        </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {articles.length === 0 && (
          <div style={{padding: '48px', textAlign: 'center', color: '#64748b'}}>
            لا توجد مقالات مضافة حالياً.
          </div>
        )}
      </div>
    </div>
  );
}
