export const signInTranslations = {
  title: "تسجيل الدخول",
  subtitle: "مرحباً بعودتك إلى SmartBox",
  emailLabel: "البريد الإلكتروني",
  emailPlaceholder: "أدخل بريدك الإلكتروني",
  passwordLabel: "كلمة المرور",
  passwordPlaceholder: "أدخل كلمة المرور",
  phoneLabel: "رقم الهاتف (اختياري)",
  phonePlaceholder: "أدخل رقم هاتفك",
  rememberMe: "تذكرني",
  forgotPassword: "نسيت كلمة المرور؟",
  signInButton: "تسجيل الدخول",
  noAccount: "ليس لديك حساب؟",
  signUpLink: "إنشاء حساب",
  errors: {
    emailRequired: "البريد الإلكتروني مطلوب",
    emailInvalid: "يرجى إدخال بريد إلكتروني صحيح",
    passwordRequired: "كلمة المرور مطلوبة",
    passwordMinLength: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    networkError: "حدث خطأ في الشبكة",
  },
  success: {
    signInSuccess: "تم تسجيل الدخول بنجاح",
  },
} as const;

export type SignInTranslations = typeof signInTranslations;
