import HeroSection from "./components/HeroSection/HeroSection";
import CategoriesSection from "./components/CategoriesSection/CategoriesSection";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;

  return (
    <main >
      <HeroSection />
      <CategoriesSection />
    </main>
  );
}
