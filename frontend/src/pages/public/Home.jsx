import SmoothScroll from '../../components/common/SmoothScroll';
import HeroSection from '../../components/home/HeroSection';
import DiscoverCarousel from '../../components/home/DiscoverCarousel';
import StudioManifesto from '../../components/home/StudioManifesto';
import AuthorSection from '../../components/home/AuthorSection';

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#F5F5DA] text-[#211D1D]">
        <HeroSection />
        <DiscoverCarousel />
        <StudioManifesto />
        <AuthorSection />
      </div>
    </SmoothScroll>
  );
}
