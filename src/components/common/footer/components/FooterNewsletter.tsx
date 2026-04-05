"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { footerDictionary as enDict } from "@/dict/common/footer/en";
import { footerDictionary as arDict } from "@/dict/common/footer/ar";
import { NewsletterProps } from "../types";

export default function FooterNewsletter({ onSubmit, email, setEmail, dictionary }: NewsletterProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const currentDictionary = locale === Language.AR ? arDict : enDict;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {currentDictionary.newsletter.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {currentDictionary.newsletter.description}
      </p>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={currentDictionary.newsletter.placeholder}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          {currentDictionary.newsletter.button}
        </button>
      </form>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        {currentDictionary.newsletter.privacyNote}
      </p>
    </div>
  );
}
