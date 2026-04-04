interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;

  return (
    <main className="flex flex-1 items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          SmartBox
        </h1>
        <p className="text-muted-foreground text-lg">
          {locale === "ar"
            ? "مرحباً بك في سمارت بوكس"
            : "Welcome to SmartBox"}
        </p>
      </div>
    </main>
  );
}
