import ResetPasswordForm from "./_components/reset-password-form";

export default function ResetPasswordPage({
  searchParams: { token },
}: {
  searchParams: {
    token?: string;
  };
}) {
  return <ResetPasswordForm token={token} />;
}
