import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInFormData } from "@/lib/validation/signInValidation";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";

export const useSignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signIn, isLoading, error, isAuthenticated, user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

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

  return {
    register,
    handleSubmit,
    errors,
    showPassword,
    setShowPassword,
    onSubmit,
    isLoading,
    error,
  };
};
