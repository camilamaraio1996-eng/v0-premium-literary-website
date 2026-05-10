import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/admin-nav'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

async function getPreorders() {
  const supabase = await createClient()
  const { data: preorders } = await supabase
    .from('preorders')
    .select('*')
    .order('created_at', { ascending: false })
  
  return preorders || []
}

export default async function AdminPreordersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/admin/login')
  }
  
  const preorders = await getPreorders()
  
  const editionLabels: Record<string, string> = {
    digital: 'Digital',
    fisica: 'Física',
    coleccionista: 'Coleccionista',
  }
  
  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={user} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-primary">Reservas</h1>
            <p className="text-muted-foreground mt-1">
              {preorders.length} reservas totales
            </p>
          </div>
        </div>
        
        {preorders.length === 0 ? (
          <div className="text-center py-12 bg-card/50 rounded-lg border border-border">
            <p className="text-muted-foreground">No hay reservas todavía.</p>
          </div>
        ) : (
          <div className="bg-card/50 rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Edición</TableHead>
                  <TableHead>Mensaje</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preorders.map((preorder) => (
                  <TableRow key={preorder.id}>
                    <TableCell className="font-medium">{preorder.name}</TableCell>
                    <TableCell>{preorder.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {editionLabels[preorder.edition] || preorder.edition}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {preorder.message || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(preorder.created_at), 'd MMM yyyy', { locale: es })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  )
}
