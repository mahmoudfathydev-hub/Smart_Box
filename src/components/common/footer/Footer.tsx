"use client";

import { useState } from "react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { footerDictionary as enDict } from "@/dict/common/footer/en";
import { footerDictionary as arDict } from "@/dict/common/footer/ar";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  Smartphone,
  Apple,
  ChevronRight,
  Heart,
} from "lucide-react";

export default function Footer() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;
  const isRTL = locale === Language.AR;
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
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
      className={`text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 flex items-center gap-1 ${
        isRTL ? "flex-row-reverse" : ""
      }`}
    >
      {children}
      <ChevronRight className="w-3 h-3" />
    </a>
  );

  // Simple SVG social media icons
  const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  const TwitterIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  );

  const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
    </svg>
  );

  const LinkedinIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );

  const YoutubeIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );

  const SocialIcon = ({ platform }: { platform: string }) => (
    <a
      href="#"
      aria-label={
        dictionary.social.platforms[
          platform as keyof typeof dictionary.social.platforms
        ]
      }
      className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors duration-200"
    >
      {platform === "facebook" && <FacebookIcon />}
      {platform === "twitter" && <TwitterIcon />}
      {platform === "instagram" && <InstagramIcon />}
      {platform === "linkedin" && <LinkedinIcon />}
      {platform === "youtube" && <YoutubeIcon />}
    </a>
  );

  return (
    <footer
      dir={isRTL ? "rtl" : "ltr"}
      className={`bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className={`py-12`}>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8 ${
              isRTL ? "xl:grid-flow-col-dense" : ""
            }`}
          >
            {/* About Section */}
            <div className="lg:col-span-2">
              <h3
                className={`text-lg font-semibold text-gray-900 dark:text-white mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {dictionary.about.title}
              </h3>
              <p
                className={`text-gray-600 dark:text-gray-400 mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {dictionary.about.description}
              </p>
              <FooterLink href="/about">{dictionary.about.link}</FooterLink>
            </div>

            {/* Quick Links */}
            <div>
              <h3
                className={`text-lg font-semibold text-gray-900 dark:text-white mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {dictionary.quickLinks.title}
              </h3>
              <ul className={`space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
                {Object.entries(dictionary.quickLinks.links).map(
                  ([key, value]) => (
                    <li key={key}>
                      <FooterLink href={`/${key}`}>{value}</FooterLink>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3
                className={`text-lg font-semibold text-gray-900 dark:text-white mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {dictionary.customerService.title}
              </h3>
              <ul className={`space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
                {Object.entries(dictionary.customerService.links).map(
                  ([key, value]) => (
                    <li key={key}>
                      <FooterLink href={`/${key}`}>{value}</FooterLink>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h3
                className={`text-lg font-semibold text-gray-900 dark:text-white mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {dictionary.contact.title}
              </h3>
              <div
                className={`space-y-3 ${isRTL ? "text-right" : "text-left"}`}
              >
                <div
                  className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {dictionary.contact.address}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {dictionary.contact.phone}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {dictionary.contact.email}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {dictionary.contact.hours}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Newsletter, Social, App */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 ${
              isRTL ? "lg:grid-flow-col-dense" : ""
            }`}
          >
            {/* Newsletter */}
            <div>
              <h3
                className={`text-lg font-semibold text-gray-900 dark:text-white mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {dictionary.newsletter.title}
              </h3>
              <p
                className={`text-gray-600 dark:text-gray-400 mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {dictionary.newsletter.description}
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className={`flex flex-col sm:flex-row gap-2 ${
                  isRTL ? "sm:flex-row-reverse" : ""
                }`}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dictionary.newsletter.placeholder}
                  className={`flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  {dictionary.newsletter.button}
                </button>
              </form>
              <p
                className={`text-sm text-gray-500 dark:text-gray-400 mt-2 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {dictionary.newsletter.privacyNote}
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h3
                className={`text-lg font-semibold text-gray-900 dark:text-white mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {dictionary.social.title}
              </h3>
              <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <SocialIcon platform="facebook" />
                <SocialIcon platform="twitter" />
                <SocialIcon platform="instagram" />
                <SocialIcon platform="linkedin" />
                <SocialIcon platform="youtube" />
              </div>
            </div>

            {/* App Download */}
            <div>
              <h3
                className={`text-lg font-semibold text-gray-900 dark:text-white mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {dictionary.app.title}
              </h3>
              <p
                className={`text-gray-600 dark:text-gray-400 mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {dictionary.app.description}
              </p>
              <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors duration-200">
                  <Apple className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-xs">Download on</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors duration-200">
                  <Smartphone className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div
              className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isRTL ? "sm:flex-row-reverse" : ""
              }`}
            >
              <div>
                <h3
                  className={`text-lg font-semibold text-gray-900 dark:text-white mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {dictionary.payment.title}
                </h3>
                <p
                  className={`text-gray-600 dark:text-gray-400 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {dictionary.payment.description}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <CreditCard className="w-8 h-8 text-gray-400" />
                <div className="flex gap-2">
                  {/* Payment method icons would go here */}
                  <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                    VISA
                  </div>
                  <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                    MC
                  </div>
                  <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                    AMEX
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-700">
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isRTL ? "sm:flex-row-reverse" : ""
            }`}
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {dictionary.copyright.text}
            </p>
            <p
              className={`text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {dictionary.copyright.madeWith}
              <Heart className="w-4 h-4 text-red-500" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
