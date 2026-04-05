"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { footerDictionary as enDict } from "@/dict/common/footer/en";
import { footerDictionary as arDict } from "@/dict/common/footer/ar";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const SocialIcon = ({
  platform,
  label,
}: {
  platform: string;
  label: string;
}) => (
  <a
    href="#"
    aria-label={label}
    className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors duration-200"
  >
    {platform === "facebook" && (
      <FaFacebook className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400" />
    )}
    {platform === "twitter" && (
      <FaTwitter className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400" />
    )}
    {platform === "instagram" && (
      <FaInstagram className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400" />
    )}
    {platform === "linkedin" && (
      <FaLinkedin className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400" />
    )}
    {platform === "youtube" && (
      <FaYoutube className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400" />
    )}
  </a>
);

export default function FooterSocial() {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {dictionary.social.title}
      </h3>
      <div className="flex gap-3">
        <SocialIcon
          platform="facebook"
          label={dictionary.social.platforms.facebook}
        />
        <SocialIcon
          platform="twitter"
          label={dictionary.social.platforms.twitter}
        />
        <SocialIcon
          platform="instagram"
          label={dictionary.social.platforms.instagram}
        />
        <SocialIcon
          platform="linkedin"
          label={dictionary.social.platforms.linkedin}
        />
        <SocialIcon
          platform="youtube"
          label={dictionary.social.platforms.youtube}
        />
      </div>
    </div>
  );
}
