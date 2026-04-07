import Link from 'next/link';

interface SignUpLinksProps {
  hasAccount: string;
  signInLink: string;
}

export default function SignUpLinks({ hasAccount, signInLink }: SignUpLinksProps) {
  return (
    <div className="text-center">
      <div className="text-sm text-neutral-600">
        {hasAccount}{' '}
        <Link href="/auth/sign-in" className="text-primary hover:underline">
          {signInLink}
        </Link>
      </div>
    </div>
  );
}
