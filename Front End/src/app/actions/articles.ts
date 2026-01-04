'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createArticle(formData: FormData) {
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const excerpt = formData.get('excerpt') as string
  const content = formData.get('content') as string
  const image = formData.get('image') as string
  const category = formData.get('category') as string
  const date = formData.get('date') as string
  const authorId = formData.get('authorId') as string
  
  const seoTitle = formData.get('seoTitle') as string
  const seoDescription = formData.get('seoDescription') as string
  const canonicalUrl = formData.get('canonicalUrl') as string

  await prisma.article.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      image,
      category,
      date,
      authorId,
      seoTitle,
      seoDescription,
      canonicalUrl
    },
  })

  revalidatePath('/admin/articles')
  revalidatePath('/')
  redirect('/admin/articles')
}

export async function updateArticle(id: number, formData: FormData) {
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const excerpt = formData.get('excerpt') as string
  const content = formData.get('content') as string
  const image = formData.get('image') as string
  const category = formData.get('category') as string
  const date = formData.get('date') as string
  const authorId = formData.get('authorId') as string
  
  const seoTitle = formData.get('seoTitle') as string
  const seoDescription = formData.get('seoDescription') as string
  const canonicalUrl = formData.get('canonicalUrl') as string

  await prisma.article.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      image,
      category,
      date,
      authorId,
      seoTitle,
      seoDescription,
      canonicalUrl
    },
  })

  revalidatePath('/admin/articles')
  revalidatePath('/')
  redirect('/admin/articles')
}

export async function deleteArticle(id: number) {
  await prisma.article.delete({
    where: { id },
  })

  revalidatePath('/admin/articles')
  revalidatePath('/')
}
