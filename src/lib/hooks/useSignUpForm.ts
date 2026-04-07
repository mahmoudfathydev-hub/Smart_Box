import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useAuth } from "./useAuth";
import { signUpSchema, SignUpFormData, validateAccessKey } from "@/lib/validation/signUpValidation";

export const useSignUpForm = () => {
  const router = useRouter();
  const { signUp, isLoading, error, isAuthenticated, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: "user",
    },
  });

  const selectedRole = watch("role");

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    if (user.role === "admin" || user.role === "employee") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }

  const validatePhone = (phone: string) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(phone);
      if (phoneNumber && phoneNumber.isValid()) {
        setPhoneError("");
        return true;
      } else {
        setPhoneError("Please enter a valid phone number");
        return false;
      }
    } catch (err) {
      setPhoneError("Please enter a valid phone number");
      return false;
    }
  };

  const formatPhoneNumber = (phone: string) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(phone);
      if (phoneNumber) {
        return phoneNumber.formatInternational();
      }
    } catch (err) {
      return phone;
    }
    return phone;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("phone", value);

    if (value) {
      validatePhone(value);
    } else {
      setPhoneError("");
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // Validate phone number before submission
      if (!validatePhone(data.phone)) {
        return;
      }

      // Validate access key for admin/employee roles
      if ((data.role === "admin" || data.role === "employee") && data.accessKey) {
        if (!validateAccessKey(data.role, data.accessKey)) {
          setPhoneError("Invalid access key for this role");
          return;
        }
      }

      const result = await signUp({
        ...data,
        number: data.phone, // Map phone to number for the API
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
    formatPhoneNumber,
    selectedRole,
  };
};
