import EmailStep from "./_components/email-step";
import NewPasswordAndConfirmPassword from "./_components/new-password-and-confirm-password";
import OtpStep from "./_components/otp-step";
import SuccessPage from "./_components/success-page";

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { active_step: string };
}) {
  const activeStep = parseInt(searchParams.active_step) || 1;
  console.log(activeStep);
  return (
    <div>
      {activeStep === 1 && <EmailStep />}
      {activeStep === 2 && <OtpStep />}
      {activeStep === 3 && <NewPasswordAndConfirmPassword />}
      {activeStep === 4 && <SuccessPage />}
    </div>
  );
}
