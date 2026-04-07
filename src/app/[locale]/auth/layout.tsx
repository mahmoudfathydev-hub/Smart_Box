import AuthProviders from "@/components/common/AuthProviders";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <AuthProviders>{children}</AuthProviders>
    </div>
  );
}
