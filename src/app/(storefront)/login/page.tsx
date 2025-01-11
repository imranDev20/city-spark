import { Suspense } from "react";
import LoginForm from "./_components/login-form";

export default function LoginPage() {
  return (
    <Suspense fallback="Loading...">
      <LoginForm />
    </Suspense>
  );
}
