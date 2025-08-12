import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VerifyEmailCardContent } from "@/features/auth/components/verify-email-card.content";

interface Props {
  searchParams: Promise<{ email: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { email } = await searchParams;

  return (
    <Card className="w-[400px]">
      <CardHeader className="text-center">
        <CardTitle className="font-bold text-xl">
          Please check your email first
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          We have sent a verification code via email. Please check it.
        </CardDescription>
      </CardHeader>
      <VerifyEmailCardContent email={email} />
    </Card>
  );
}
