"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type SettlementStep = {
  id: string;
  label: string;
  description: string;
  durationMs: number;
};

const DEFAULT_STEPS: SettlementStep[] = [
  {
    id: "initiated",
    label: "Payment initiated",
    description: "Sender confirmed remittance from UAE wallet",
    durationMs: 400,
  },
  {
    id: "compliance",
    label: "Compliance screening",
    description: "Recipient address screened via Circle compliance hooks",
    durationMs: 800,
  },
  {
    id: "routing",
    label: "Gateway routing",
    description: "Circle Gateway selects optimal USDC liquidity path",
    durationMs: 600,
  },
  {
    id: "bridge",
    label: "Cross-chain transfer",
    description: "CCTP / Bridge Kit moves USDC to Arc testnet",
    durationMs: 1200,
  },
  {
    id: "settled",
    label: "Settled on Arc",
    description: "Deterministic finality in under 1 second",
    durationMs: 500,
  },
];

type SettlementTrackerProps = {
  active?: boolean;
  onComplete?: () => void;
  txHash?: string;
  className?: string;
};

export function SettlementTracker({
  active = false,
  onComplete,
  txHash,
  className,
}: SettlementTrackerProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!active) {
      setCurrentStep(-1);
      setCompleted(false);
      return;
    }

    let stepIndex = 0;
    setCurrentStep(0);

    const advance = () => {
      if (stepIndex >= DEFAULT_STEPS.length - 1) {
        setCompleted(true);
        onComplete?.();
        return;
      }
      stepIndex += 1;
      setCurrentStep(stepIndex);
      setTimeout(advance, DEFAULT_STEPS[stepIndex].durationMs);
    };

    const timer = setTimeout(advance, DEFAULT_STEPS[0].durationMs);
    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!active && currentStep < 0) return null;

  return (
    <div className={cn("rounded-lg border p-4 space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Zap className="size-4 text-amber-500" />
        <p className="text-sm font-medium">Real-time settlement tracker</p>
        {!completed && active && (
          <Loader2 className="size-3 animate-spin text-muted-foreground ml-auto" />
        )}
        {completed && (
          <span className="ml-auto text-xs font-medium text-green-600 dark:text-green-400">
            Confirmed &lt; 1s on Arc
          </span>
        )}
      </div>

      <ol className="space-y-3">
        {DEFAULT_STEPS.map((step, index) => {
          const isDone = completed || index < currentStep;
          const isCurrent = !completed && index === currentStep;

          return (
            <li key={step.id} className="flex gap-3">
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="size-4 text-green-500" />
                ) : isCurrent ? (
                  <Loader2 className="size-4 animate-spin text-blue-500" />
                ) : (
                  <Circle className="size-4 text-muted-foreground/40" />
                )}
              </div>
              <div className="space-y-0.5">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isDone && "text-green-700 dark:text-green-300",
                    isCurrent && "text-blue-600 dark:text-blue-400"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {completed && txHash && (
        <p className="text-xs font-mono text-muted-foreground break-all">
          Tx: {txHash}
        </p>
      )}
    </div>
  );
}