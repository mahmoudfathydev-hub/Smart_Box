import Link from "next/link";

interface SignInLinksProps {
  noAccount: string;
  signUpLink: string;
}

export default function SignInLinks({ noAccount, signUpLink }: SignInLinksProps) {
  return (
    <div className="text-center">
      <div className="text-sm text-neutral-600">
        {noAccount}{" "}
        <Link href="/auth/sign-up" className="text-primary hover:underline">
          {signUpLink}
        </Link>
      </div>
    </div>
  );
}
