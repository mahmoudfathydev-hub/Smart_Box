import HeroSection from "./components/HeroSection/HeroSection";
import CategoriesSection from "./components/CategoriesSection/CategoriesSection";
import FeaturedProductsSection from "./components/FeaturedProductsSection/FeaturedProductsSection";
import DealsSection from "./components/DealsSection/DealsSection";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;

  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <DealsSection />
    </main>
  );
}
