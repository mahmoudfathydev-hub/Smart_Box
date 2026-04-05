export interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

export interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

export interface SocialIconProps {
  platform: string;
}

export interface NewsletterProps {
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (email: string) => void;
  dictionary: any;
}

export interface ContactInfoProps {
  dictionary: any;
}
