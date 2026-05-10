import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PostContent } from '@/components/diario/post-content'
import { createClient } from '@/lib/supabase/server'

// Sample posts for static generation and fallback
const samplePosts = {
  'arte-de-sonar-despierto': {
    id: '1',
    title: 'Sobre el arte de soñar despierto',
    slug: 'arte-de-sonar-despierto',
    excerpt: 'Hay quienes dicen que soñar despierto es perder el tiempo.',
    content: `Hay quienes dicen que soñar despierto es perder el tiempo. Yo creo que es la forma más honesta de estar vivo.

Los sueños diurnos son bocetos de la imaginación, ensayos generales de mundos posibles. En ellos practicamos ser quienes todavía no somos, vivimos vidas que quizá nunca viviremos, decimos palabras que nunca nos atreveremos a pronunciar.

## El valor de la ensoñación

La ensoñación ha sido menospreciada por una cultura obsesionada con la productividad. Se nos dice que debemos estar presentes, atentos, enfocados. Pero ¿enfocados en qué? ¿Presentes dónde?

A veces, la mente necesita vagar. Necesita perderse en caminos sin destino, explorar territorios sin mapa. Es en esos momentos de aparente distracción cuando surgen las ideas más brillantes, las conexiones más inesperadas.

## Sueños que escriben libros

Esta novela nació de un sueño diurno. Estaba en una cafetería, mirando por la ventana sin ver realmente nada, cuando apareció el primer fragmento: un hombre que soñaba recuerdos ajenos.

No sé de dónde vino. No sé por qué llegó en ese momento. Solo sé que estaba ahí, esperando a ser notado, como esos sueños que se quedan flotando en el borde de la conciencia hasta que decides prestarles atención.

> "La imaginación es la loca de la casa", dijo Santa Teresa. Yo prefiero pensar que es la única que sabe dónde está la puerta.

## Permiso para soñar

Te invito a soñar despierto. A perder el tiempo de manera productiva. A dejar que tu mente vague sin rumbo, sin culpa, sin prisa.

Quizá en alguno de esos sueños encuentres algo que valga la pena contar. O quizá simplemente descubras que soñar, en sí mismo, ya es suficiente razón para estar vivo.`,
    category: 'Reflexión',
    reading_time: 5,
    created_at: '2026-05-15T10:00:00Z',
    cover_image: null
  },
  'proceso-escribir-suenos': {
    id: '2',
    title: 'El proceso de escribir sobre los sueños',
    slug: 'proceso-escribir-suenos',
    excerpt: 'Cada noche, antes de dormir, dejo un cuaderno junto a la cama.',
    content: `Cada noche, antes de dormir, dejo un cuaderno junto a la cama. Los sueños más reveladores son los que olvidamos primero, los que se desvanecen con las primeras luces del día.

## El ritual del cuaderno

El cuaderno no es elegante. No tiene que serlo. Es simplemente una herramienta, un recipiente para capturar fragmentos antes de que se evaporen.

A veces escribo en la oscuridad, con letra ilegible que luego tendré que descifrar como si fueran jeroglíficos de mi propio inconsciente. Otras veces enciendo la lámpara y escribo con más calma, sabiendo que cada segundo que pasa los detalles se difuminan.

## Lo que los sueños revelan

Los sueños no son mensajes cifrados que debemos interpretar. Son más bien... paisajes. Territorios emocionales que nuestra mente construye con los materiales del día, de la vida, de los miedos y deseos que no sabemos nombrar despiertos.

En mis sueños aparecen personas que conozco con rostros de extraños. Lugares que he visitado mil veces pero que en el sueño están transformados, son versiones alternativas de sí mismos.

> "El sueño es un segundo planeta", escribió alguien. Y es verdad: cada noche viajamos a un lugar donde las reglas son diferentes.

## De los sueños a la página

El mayor desafío de escribir sobre sueños es conservar esa cualidad etérea, esa lógica que no es lógica, sin que el texto se vuelva incomprensible.

He aprendido que la clave está en los detalles sensoriales. No explicar qué significa que mi madre tenga las manos jóvenes en el sueño, sino describir exactamente cómo se ven esas manos, cómo sostienen las cosas.

El significado emerge de la imagen, no al revés.`,
    category: 'Proceso Creativo',
    reading_time: 7,
    created_at: '2026-05-10T10:00:00Z',
    cover_image: null
  },
  'memoria-materia-prima': {
    id: '3',
    title: 'La memoria como materia prima',
    slug: 'memoria-materia-prima',
    excerpt: 'La ficción y la memoria comparten un secreto.',
    content: `La ficción y la memoria comparten un secreto: ambas reconstruyen lo que alguna vez fue real. Cada vez que recordamos, inventamos; cada vez que inventamos, recordamos.

## El acto de recordar

Recordar no es como abrir un archivo en una computadora. No es recuperar información almacenada de manera perfecta e inmutable. Recordar es recrear, es volver a construir una escena con los materiales que tenemos a mano en el momento presente.

Cada vez que recuerdo la casa de mi infancia, la reconstruyo de manera ligeramente diferente. Los colores cambian sutilmente, los espacios se expanden o contraen, los rostros de quienes la habitaban se mezclan con rostros de otras épocas.

## Ficción y verdad

¿Esto hace que mis recuerdos sean falsos? No creo. Creo que los hace profundamente verdaderos, de una verdad que va más allá de la exactitud fotográfica.

La ficción opera de manera similar. Cuando escribo sobre un personaje que jamás existió, estoy de alguna manera recordándolo. Estoy trayendo a la superficie algo que ya estaba ahí, en algún rincón de mi experiencia acumulada.

> "Todo lo que puedo contar es mi experiencia, mi verdad", dijo una vez un escritor que admiraba. Y esa verdad siempre está filtrada por la memoria, que es nuestra primera y más fiel narradora de ficciones.

## La materia prima del escritor

La memoria es la materia prima del escritor, pero no como un archivo del que se extrae información, sino como un jardín que cultivamos, podamos, y del que cosechamos frutos que a veces ni siquiera recordamos haber sembrado.

Esta novela está hecha de memorias: mías, prestadas, imaginadas, soñadas. Todas igualmente reales, todas igualmente ficticias.`,
    category: 'Escritura',
    reading_time: 4,
    created_at: '2026-05-05T10:00:00Z',
    cover_image: null
  }
}

type SamplePost = typeof samplePosts[keyof typeof samplePosts]

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string): Promise<SamplePost | null> {
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  
  if (post) return post as unknown as SamplePost
  
  // Fallback to sample posts
  return samplePosts[slug as keyof typeof samplePosts] || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return {
      title: 'Entrada no encontrada'
    }
  }
  
  return {
    title: post.title,
    description: post.excerpt || undefined,
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    notFound()
  }
  
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <PostContent post={post} />
      </main>
      <Footer />
    </>
  )
}
