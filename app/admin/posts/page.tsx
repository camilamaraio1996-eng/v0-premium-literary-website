import { createClient } from '@/lib/supabase/server'
import { PostsTable } from '@/components/admin/posts-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

async function getPosts() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  
  return posts || []
}

export default async function AdminPostsPage() {
  const posts = await getPosts()
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-primary">Entradas del Blog</h1>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Entrada
          </Link>
        </Button>
      </div>
      
      <PostsTable posts={posts} />
    </div>
  )
}
