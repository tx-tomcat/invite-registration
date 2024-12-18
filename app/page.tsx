// app/register/page.tsx
import { RegistrationForm } from "@/components/TabRegistrationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Your App Name",
  description: "Register using your invite code",
};

export default function RegisterPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <RegistrationForm />
    </main>
  );
}
