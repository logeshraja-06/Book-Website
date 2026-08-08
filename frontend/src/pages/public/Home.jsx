import SmoothScroll from '../../components/common/SmoothScroll';
import HeroSection from '../../components/home/HeroSection';
import FeaturedSection from '../../components/home/FeaturedSection';
import CategorySection from '../../components/home/CategorySection';
import AuthorSection from '../../components/home/AuthorSection';
import PublishingProcessSection from '../../components/home/PublishingProcessSection';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import BlogPreviewSection from '../../components/home/BlogPreviewSection';
import NewsletterSection from '../../components/home/NewsletterSection';
import QuoteSection from '../../components/home/QuoteSection';
import ClosingCTA from '../../components/home/ClosingCTA';

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#F5F5DA] text-[#211D1D]">
        <HeroSection />
        <FeaturedSection />
        <PublishingProcessSection />
        <CategorySection />
        <AuthorSection />
        <TestimonialsSection />
        <BlogPreviewSection />
        <QuoteSection />
        <NewsletterSection />
        <ClosingCTA />
      </div>
    </SmoothScroll>
  );
}
