"use client";

import { signUpTranslations } from "@/dict/auth/SignUp";
import { useParams } from "next/navigation";
import { useSignUpForm } from "@/lib/hooks/useSignUpForm";
import SignUpCard from "./SignUpCard";
import SignUpForm from "./SignUpForm";
import SignUpLinks from "./SignUpLinks";

export default function SignUpContainer() {
  const params = useParams();
  const locale = (params.locale as "en" | "ar") || "en";
  const t = signUpTranslations[locale];

  const {
    register,
    handleSubmit,
    control,
    errors,
    watch,
    setValue,
    showPassword,
    setShowPassword,
    onSubmit,
    isLoading,
    error,
    phoneError,
    handlePhoneChange,
    handleCountryCodeChange,
    formatPhoneNumber,
    selectedCountryCode,
  } = useSignUpForm();

  return (
    <SignUpCard title={t.title} subtitle={t.subtitle}>
      <SignUpForm
        register={register}
        handleSubmit={handleSubmit}
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        phoneError={phoneError}
        handlePhoneChange={handlePhoneChange}
        handleCountryCodeChange={handleCountryCodeChange}
        formatPhoneNumber={formatPhoneNumber}
        selectedCountryCode={selectedCountryCode}
        t={t}
      />
      <div className="mt-6">
        <SignUpLinks hasAccount={t.hasAccount} signInLink={t.signInLink} />
      </div>
    </SignUpCard>
  );
}
