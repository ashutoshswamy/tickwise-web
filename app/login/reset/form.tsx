"use client";
import { sendPasswordResetEmail } from "firebase/auth";
import { MagicLinkForm } from "@ashutoshswamy/smoui";
import { clientAuth } from "@/lib/firebase-client";

export default function ResetForm() {
  return (
    <MagicLinkForm
      className="auth-card"
      title="Reset your password"
      description="Enter your email and we will send you a link to choose a new one."
      onSend={async (email) => {
        try {
          await sendPasswordResetEmail(clientAuth, email);
        } catch (e) {
          const code = (e as { code?: string }).code;
          throw new Error(code === "auth/invalid-email" ? "Enter a valid email address." : "Could not send the email. Try again in a minute.");
        }
      }}
    />
  );
}
