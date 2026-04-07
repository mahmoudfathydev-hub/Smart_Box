import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SignUpCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function SignUpCard({ title, subtitle, children }: SignUpCardProps) {
  return (
    <div className="w-full max-w-md">
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
