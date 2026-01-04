import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { updateArticle } from '@/app/actions/articles'
import ArticleForm from '@/components/admin/ArticleForm'

export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
}

export default async function EditArticlePage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const id = parseInt(resolvedParams.id);
  
  if (isNaN(id)) notFound();

  const [article, authors] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    prisma.author.findMany()
  ])

  if (!article) notFound()

  // Bind the article ID to the server action
  const updateAction = updateArticle.bind(null, article.id)

  return (
    <ArticleForm 
      authors={authors} 
      article={article} 
      action={updateAction} 
    />
  )
}
