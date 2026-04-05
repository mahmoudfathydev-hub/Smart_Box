"use client";

import { useState } from "react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { footerDictionary as enDict } from "@/dict/common/footer/en";
import { footerDictionary as arDict } from "@/dict/common/footer/ar";
import { ChevronRight } from "lucide-react";

// Import footer components
import FooterAbout from "./components/FooterAbout";
import FooterLinks from "./components/FooterLinks";
import FooterContact from "./components/FooterContact";
import FooterNewsletter from "./components/FooterNewsletter";
import FooterSocial from "./components/FooterSocial";
import FooterApp from "./components/FooterApp";
import FooterPayment from "./components/FooterPayment";
import FooterCopyright from "./components/FooterCopyright";

export default function Footer() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;
  const isRTL = locale === Language.AR;
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  const FooterLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a
      href={href}
      className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 flex items-center gap-1"
    >
      {children}
      <ChevronRight className="w-3 h-3 rtl:rotate-180" />
    </a>
  );

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {/* About Section */}
            <FooterAbout FooterLink={FooterLink} />

            {/* Quick Links and Customer Service */}
            <FooterLinks FooterLink={FooterLink} />

            {/* Contact Info */}
            <FooterContact />
          </div>

          {/* Second Row - Newsletter, Social, App */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            {/* Newsletter */}
            <FooterNewsletter
              onSubmit={handleNewsletterSubmit}
              email={email}
              setEmail={setEmail}
              dictionary={dictionary}
            />

            {/* Social Media */}
            <FooterSocial />

            {/* App Download */}
            <FooterApp />
          </div>

          {/* Payment Methods */}
          <FooterPayment />
        </div>

        {/* Copyright */}
        <FooterCopyright />
      </div>
    </footer>
  );
}
