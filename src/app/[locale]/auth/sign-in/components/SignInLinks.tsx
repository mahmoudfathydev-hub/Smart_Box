import Link from 'next/link';

interface SignInLinksProps {
  forgotPassword: string;
  noAccount: string;
  signUpLink: string;
}

export default function SignInLinks({ forgotPassword, noAccount, signUpLink }: SignInLinksProps) {
  return (
    <div className="text-center space-y-2">
      <Link
        href="/auth/forgot-password"
        className="text-sm text-primary hover:underline"
      >
        {forgotPassword}
      </Link>
      <div className="text-sm text-neutral-600">
        {noAccount}{' '}
        <Link href="/auth/sign-up" className="text-primary hover:underline">
          {signUpLink}
        </Link>
      </div>
    </div>
  );
}
