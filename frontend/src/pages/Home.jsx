import Hero from '../components/home/Hero.jsx';
import StatsBar from '../components/home/StatsBar.jsx';
import FeaturedServices from '../components/home/FeaturedServices.jsx';
import AcademyHighlights from '../components/home/AcademyHighlights.jsx';
import TestimonialPreview from '../components/home/TestimonialPreview.jsx';
import OffersPreview from '../components/home/OffersPreview.jsx';
import GalleryPreview from '../components/home/GalleryPreview.jsx';
import Newsletter from '../components/home/Newsletter.jsx';

/**
 * Home — the real homepage (replaces the Phase 1 design-system placeholder).
 * Section order follows the phase brief: hero -> stats -> services ->
 * academy -> testimonials -> offers -> gallery -> newsletter. Each section
 * is self-contained and reads its own content from src/data/*.js, so
 * reordering or removing a section is just adding/removing one line here.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturedServices />
      <AcademyHighlights />
      <TestimonialPreview />
      <OffersPreview />
      <GalleryPreview />
      <Newsletter />
    </>
  );
}
