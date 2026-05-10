import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero-section'
import { AboutBookSection } from '@/components/home/about-book-section'
import { FeaturedFragmentSection } from '@/components/home/featured-fragment-section'
import { BlogPreviewSection } from '@/components/home/blog-preview-section'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <AboutBookSection />
        <FeaturedFragmentSection />
        <BlogPreviewSection />
      </main>
      <Footer />
    </>
  )
}
