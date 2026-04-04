import HeroSection from "./components/HeroSection/HeroSection";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;

  return (
    <main className="flex flex-1 items-center justify-center bg-background text-foreground">
      <HeroSection />
    </main>
  );
}
