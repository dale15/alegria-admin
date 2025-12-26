import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import LoginForm from "@/components/forms/login-form";

export default function LoginPage() {
    return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Alegria&apos;s Admin Login
        </CardTitle>
      </CardHeader>

      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
    );
}