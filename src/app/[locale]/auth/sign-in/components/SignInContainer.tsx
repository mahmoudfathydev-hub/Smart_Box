"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { signInTranslations } from "@/dict/auth/SignIn";
import { useParams } from "next/navigation";
import { SignInFormData } from "@/lib/validation/authValidation";
import SignInCard from "./SignInCard";
import SignInForm from "./SignInForm";
import SignInLinks from "./SignInLinks";

export default function SignInContainer() {
  const params = useParams();
  const locale = (params.locale as "en" | "ar") || "en";
  const t = signInTranslations[locale];
  const router = useRouter();
  const { signIn, isLoading, error, isAuthenticated, user } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    if (user.role === "admin" || user.role === "employee") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signIn({
        email: data.email,
        password: data.password,
      });

      if (result.meta.requestStatus === "fulfilled") {
        // Redirect will be handled by the useEffect above
        if (user?.role === "admin" || user?.role === "employee") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      // Error is handled by the auth slice
    }
  };

  return (
    <SignInCard title={t.title} subtitle={t.subtitle}>
      <SignInForm onSubmit={onSubmit} isLoading={isLoading} error={error} t={t} />
      <div className="mt-6">
        <SignInLinks
          forgotPassword={t.forgotPassword}
          noAccount={t.noAccount}
          signUpLink={t.signUpLink}
        />
      </div>
    </SignInCard>
  );
}
