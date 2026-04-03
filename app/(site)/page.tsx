import {
  HeroSection,
  TrustBar,
  ServicesPreview,
  OccasionNav,
  FeaturedCollection,
  ChefIntro,
  OccasionEditorial,
  CustomerGallery,
  Testimonials,
  JournalPreview,
  NewsletterSection,
} from "@/components/site/home";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ServicesPreview />
      <OccasionNav />
      <FeaturedCollection />
      <ChefIntro />
      <OccasionEditorial />
      <CustomerGallery />
      <Testimonials />
      <JournalPreview />
      <NewsletterSection />
    </>
  );
}
