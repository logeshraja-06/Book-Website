import SmoothScroll from '../../components/common/SmoothScroll';
import HeroSection from '../../components/home/HeroSection';
import QuickDiscoveryBar from '../../components/home/QuickDiscoveryBar';
import FeaturedSection from '../../components/home/FeaturedSection';
import DiscoverCarousel from '../../components/home/DiscoverCarousel';
import IndianBookshelf from '../../components/home/IndianBookshelf';
import CategorySection from '../../components/home/CategorySection';
import AuthorSection from '../../components/home/AuthorSection';
import ReaderShowcase from '../../components/home/ReaderShowcase';
import WhyBookVerse from '../../components/home/WhyBookVerse';
import PublishingProcessSection from '../../components/home/PublishingProcessSection';
import QuoteSection from '../../components/home/QuoteSection';
import NewsletterSection from '../../components/home/NewsletterSection';
import ClosingCTA from '../../components/home/ClosingCTA';

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#F5F5DA] text-[#211D1D]">
        <HeroSection />
        <QuickDiscoveryBar />
        <FeaturedSection />
        <DiscoverCarousel />
        <IndianBookshelf />
        <CategorySection />
        <AuthorSection />
        <ReaderShowcase />
        <WhyBookVerse />
        <PublishingProcessSection />
        <QuoteSection />
        <NewsletterSection />
        <ClosingCTA />
      </div>
    </SmoothScroll>
  );
}
