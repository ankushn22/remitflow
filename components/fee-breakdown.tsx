"use client";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { FeeBreakdown } from "@/lib/utils/remittance-fees";
import type { RemittanceCorridor } from "@/lib/constants/remittance-corridors";

type FeeBreakdownCardProps = {
  fees: FeeBreakdown;
  corridor: RemittanceCorridor;
};

function formatUsdc(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatAed(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function FeeBreakdownCard({ fees, corridor }: FeeBreakdownCardProps) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Transparent fee breakdown</p>
        <Badge variant="secondary" className="text-xs">
          Pay in AED · Settle in USDC
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">You send</span>
          <span className="font-medium">
            {formatAed(fees.sendAmountAed)} AED · ${formatUsdc(fees.sendAmountUsdc)} USDC
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Platform fee</span>
          <span>${formatUsdc(fees.platformFeeUsdc)} USDC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Arc network fee</span>
          <span>${formatUsdc(fees.networkFeeUsdc)} USDC</span>
        </div>
        {fees.bridgeFeeUsdc > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">CCTP / Bridge Kit</span>
            <span>${formatUsdc(fees.bridgeFeeUsdc)} USDC</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-between text-sm font-semibold">
        <span>Recipient receives</span>
        <span className="text-green-600 dark:text-green-400">
          ${formatUsdc(fees.recipientReceivesUsdc)} USDC
        </span>
      </div>

      <div className="rounded-md bg-green-500/10 border border-green-500/20 p-3 text-xs space-y-1">
        <p className="font-medium text-green-700 dark:text-green-300">
          Save ~{formatAed(fees.savingsAed)} AED ({fees.savingsPercent.toFixed(0)}%) vs traditional{" "}
          {corridor.toCountry} remittance
        </p>
        <p className="text-muted-foreground">
          Traditional corridor fee: ~{corridor.traditionalFeePercent}% · RemitFlow total: ~
          {((fees.totalFeesUsdc / fees.sendAmountUsdc) * 100 || 0).toFixed(1)}%
        </p>
      </div>
    </div>
  );
}