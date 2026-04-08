import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useAuth } from "./useAuth";
import { signUpSchema, SignUpFormData, validateAccessKey } from "@/lib/validation/signUpValidation";
import {
  getDefaultCountry,
  getCountryByDialCode,
  Country,
  getCountryByCode,
} from "@/lib/data/countries";

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
      countryCode: getDefaultCountry().code,
    },
  });

  const selectedRole = watch("role");
  const selectedCountryCode = watch("countryCode");

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    if (user.role === "admin" || user.role === "employee") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }

  const validatePhone = (number: string, countryCode?: string) => {
    try {
      const selectedCode = countryCode || selectedCountryCode;
      const country = getCountryByCode(selectedCode);

      if (!country) {
        setPhoneError("Please select a valid country");
        return false;
      }

      const dialCode = country.dialCode;
      const cleanNumber = number.replace(/\D/g, "");

      // For Egyptian numbers, handle common case where users enter without the leading 0
      let phoneNumberToTest = cleanNumber;
      if (dialCode === "+20" && cleanNumber.startsWith("0")) {
        phoneNumberToTest = cleanNumber.substring(1);
      }

      const fullPhoneNumber = `${dialCode}${phoneNumberToTest}`;

      const phoneNumber = parsePhoneNumberFromString(fullPhoneNumber);

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

  const formatPhoneNumber = (phone: string, countryCode?: string) => {
    try {
      const selectedCode = countryCode || selectedCountryCode;
      const country = getCountryByCode(selectedCode);
      if (!country) {
        return phone;
      }

      const dialCode = country.dialCode;
      const cleanPhone = phone.replace(/\D/g, "");

      let phoneNumberToTest = cleanPhone;
      if (dialCode === "+20" && cleanPhone.startsWith("0")) {
        phoneNumberToTest = cleanPhone.substring(1);
      }

      const fullPhoneNumber = `${dialCode}${phoneNumberToTest}`;
      const phoneNumber = parsePhoneNumberFromString(fullPhoneNumber);

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
    setValue("number", value);

    if (value) {
      validatePhone(value);
    } else {
      setPhoneError("");
    }
  };

  const handleCountryCodeChange = (countryCode: string) => {
    setValue("countryCode", countryCode);
    const currentNumber = watch("number");
    if (currentNumber) {
      validatePhone(currentNumber, countryCode);
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // Validate phone number before submission
      if (!validatePhone(data.number, data.countryCode)) {
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
        number: data.number,
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
    handleCountryCodeChange,
    formatPhoneNumber,
    selectedCountryCode,
    selectedRole,
  };
};
