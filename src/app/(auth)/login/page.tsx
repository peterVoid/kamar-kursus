import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GithubButton } from "@/features/auth/components/github-button";
import { LoginForm } from "@/features/auth/components/login-form";

export default function Page() {
  return (
    <Card className="w-[400px] gap-2">
      <CardHeader>
        <CardTitle className="font-bold text-2xl">Selamat datang!</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Login dengan akun Github atau Email Account
        </CardDescription>
        <div className="mt-3">
          <GithubButton />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-0.5 mb-3">
          <div className="flex-1 h-[1px] bg-muted-foreground" />
          <div className="text-muted-foreground text-sm">
            atau lanjutkan dengan
          </div>
          <div className="flex-1 h-[1px] bg-muted-foreground" />
        </div>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
