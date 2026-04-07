import { signInTranslations as en } from './en';
import { signInTranslations as ar } from './ar';

export const signInTranslations = {
  en,
  ar,
} as const;

export type SignInTranslations = typeof signInTranslations;
