"use client";

import { signInTranslations } from "@/dict/auth/SignIn";
import { useParams } from "next/navigation";
import { useSignInForm } from "@/lib/hooks/useSignInForm";
import SignInCard from "./SignInCard";
import SignInForm from "./SignInForm";
import SignInLinks from "./SignInLinks";

export default function SignInContainer() {
  const params = useParams();
  const locale = (params.locale as "en" | "ar") || "en";
  const t = signInTranslations[locale];

  const {
    register,
    handleSubmit,
    errors,
    showPassword,
    setShowPassword,
    onSubmit,
    isLoading,
    error,
  } = useSignInForm();

  return (
    <SignInCard title={t.title} subtitle={t.subtitle}>
      <SignInForm
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        t={t}
      />
      <div className="mt-6">
        <SignInLinks noAccount={t.noAccount} signUpLink={t.signUpLink} />
      </div>
    </SignInCard>
  );
}
