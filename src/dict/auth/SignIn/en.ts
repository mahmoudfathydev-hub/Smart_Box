export const signInTranslations = {
  title: "Sign In",
  subtitle: "Welcome back to SmartBox",
  emailLabel: "Email",
  emailPlaceholder: "Enter your email",
  passwordLabel: "Password",
  passwordPlaceholder: "Enter your password",
  phoneLabel: "Phone (Optional)",
  phonePlaceholder: "Enter your phone number",
  rememberMe: "Remember me",
  signInButton: "Sign In",
  noAccount: "Don't have an account?",
  signUpLink: "Sign up",
  errors: {
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email",
    passwordRequired: "Password is required",
    passwordMinLength: "Password must be at least 8 characters",
    invalidCredentials: "Invalid email or password",
    networkError: "Network error occurred",
  },
  success: {
    signInSuccess: "Sign in successful",
  },
} as const;

export type SignInTranslations = typeof signInTranslations;
