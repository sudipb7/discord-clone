import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailVerificationOtp(email: string, otp: number) {
  try {
    await resend.emails.send({
      from: process.env.NEXT_PUBLIC_RESEND_EMAIL!,
      to: email,
      subject: "Verify your email",
      html: `<p>Please confirm your email by entering the following code: <strong>${otp}</strong></p>`,
    });
  } catch (error) {
    console.log("RESEND_VERIFICATION_EMAIL_ERROR", error);
    return null;
  }
}
