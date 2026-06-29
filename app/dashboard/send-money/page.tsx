"use client";

import { RemittanceSendForm } from "@/components/remittance-send-form";

export default function SendMoneyPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Send Money</h1>
        <p className="text-muted-foreground mt-1">
          UAE → Global remittances with instant USDC settlement on Arc
        </p>
      </div>
      <RemittanceSendForm />
    </div>
  );
}