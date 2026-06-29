/**
 * Copyright 2026 Circle Internet Group, Inc.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Globe,
  Wallet,
  ArrowRightLeft,
  Clock,
  Shield,
  Send,
} from "lucide-react";

export function Hero() {
  return (
    <div className="flex flex-col items-center w-full px-5">
      <section className="w-full max-w-6xl space-y-16 py-8">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Globe className="w-8 h-8 text-blue-500" />
              <Zap className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-amber-600 leading-tight">
              Instant UAE Remittances on Arc
            </p>
            <p className="mt-4 text-xl md:text-2xl text-center text-muted-foreground max-w-3xl">
              Pay in AED. Settle in USDC. Confirm in under one second with Circle Wallets, Gateway,
              and CCTP on Arc.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-green-500" />
              <span>Sub-second Arc finality</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-blue-500" />
              <span>Compliance screening</span>
            </div>
            <div className="flex items-center gap-2">
              <Send className="size-4 text-amber-500" />
              <span>UAE → India, Pakistan, Philippines & more</span>
            </div>
          </div>
        </div>

        <section className="w-full space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Built on Circle&apos;s Stablecoin Commerce Stack
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Wallet className="w-8 h-8 text-blue-500" />}
              title="Circle Wallets"
              description="Embedded wallets for senders and recipients — no seed phrases, crypto-native UX hidden."
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8 text-green-500" />}
              title="Circle Gateway"
              description="Unified USDC balance routes treasury liquidity across chains for remittance payouts."
            />
            <FeatureCard
              icon={<ArrowRightLeft className="w-8 h-8 text-amber-500" />}
              title="CCTP / Bridge Kit"
              description="Cross-chain USDC movement from source chains to Arc settlement rail."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-purple-500" />}
              title="Arc USDC Gas"
              description="Predictable dollar-denominated fees and deterministic finality for real-time remittances."
            />
          </div>
        </section>
      </section>

      <section className="w-full bg-gradient-to-b from-background to-muted/50 py-16 rounded-xl">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">How RemitFlow Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start px-5">
            <Step
              title="Enter AED amount"
              description="Sender in UAE enters amount in familiar AED with transparent fee preview."
            />
            <Step
              title="Screen & route"
              description="Compliance check + Circle Gateway selects optimal USDC liquidity path."
            />
            <Step
              title="Bridge to Arc"
              description="CCTP / Bridge Kit moves USDC to Arc testnet for settlement."
            />
            <Step
              title="Instant receipt"
              description="Recipient receives USDC with sub-second Arc confirmation and on-chain receipt."
            />
          </div>
        </div>
      </section>

      <section className="w-full max-w-5xl py-16 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to send your first remittance?</h2>
          <p className="text-lg text-muted-foreground">
            Educational and testnet demo only. Built for the Stablecoin Commerce Stack Challenge.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Link href="/auth/sign-up">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/dashboard/send-money">
            <Button variant="outline" size="lg">
              Send Money
            </Button>
          </Link>
        </div>
      </section>

      <footer className="w-full border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-5 text-center text-sm text-muted-foreground">
          RemitFlow · Stablecoin Commerce Stack Challenge · Track 1: Cross-Border Payments · Testnet
          demo only
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-card p-6 rounded-lg border border-border">
    <div className="flex items-center justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
    <p className="text-muted-foreground text-center">{description}</p>
  </div>
);

function Step({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-4 mb-4">
        <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}