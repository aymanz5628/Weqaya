import { prisma } from '@/lib/prisma'
import { createArticle } from '@/app/actions/articles'
import ArticleForm from '@/components/admin/ArticleForm'

export const dynamic = 'force-dynamic'

export default async function NewArticlePage() {
  const authors = await prisma.author.findMany()

  return (
    <ArticleForm 
      authors={authors} 
      action={createArticle} 
    />
  )
}
