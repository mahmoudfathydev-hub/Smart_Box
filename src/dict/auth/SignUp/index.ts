import { signUpTranslations as en } from './en';
import { signUpTranslations as ar } from './ar';

export const signUpTranslations = {
  en,
  ar,
} as const;

export type SignUpTranslations = typeof signUpTranslations;
