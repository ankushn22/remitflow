"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconLoader2,
  IconSend,
  IconWorld,
  IconReceipt,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { AlertTriangle, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceStatusBadge } from "@/components/compliance-status-badge";
import { ComplianceDetailsDialog } from "@/components/compliance-details-dialog";
import { FeeBreakdownCard } from "@/components/fee-breakdown";
import { SettlementTracker } from "@/components/settlement-tracker";
import {
  REMITTANCE_CORRIDORS,
  getCorridorById,
} from "@/lib/constants/remittance-corridors";
import { calculateFeeBreakdown } from "@/lib/utils/remittance-fees";
import { isValidAddress } from "@/lib/compliance/utils";
import { useBalanceContext } from "@/lib/contexts/balance-context";
import type { ComplianceCheckResponse } from "@/types/compliance";

type RemittanceReceipt = {
  id: string;
  corridorId: string;
  recipientName: string;
  amountAed: number;
  amountUsdc: number;
  recipientReceivesUsdc: number;
  recipientAddress: string;
  createdAt: string;
  status: "CONFIRMED" | "PENDING";
};

export function RemittanceSendForm() {
  const [corridorId, setCorridorId] = useState("uae-india");
  const [amountAed, setAmountAed] = useState("500");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [complianceData, setComplianceData] = useState<ComplianceCheckResponse | null>(null);
  const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);
  const [showComplianceDetails, setShowComplianceDetails] = useState(false);
  const [showReviewWarning, setShowReviewWarning] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [trackingActive, setTrackingActive] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<RemittanceReceipt | null>(null);

  const { gatewayTotal, refreshGatewayBalance, refreshWalletBalance } = useBalanceContext();

  const corridor = useMemo(
    () => getCorridorById(corridorId) ?? REMITTANCE_CORRIDORS[0],
    [corridorId]
  );

  const parsedAed = parseFloat(amountAed) || 0;
  const fees = useMemo(
    () => calculateFeeBreakdown(parsedAed, corridor),
    [parsedAed, corridor]
  );

  useEffect(() => {
    if (!recipientAddress) {
      setComplianceData(null);
      setAddressError("");
      return;
    }

    if (recipientAddress.length > 0 && !isValidAddress(recipientAddress)) {
      setComplianceData(null);
      setAddressError("Invalid blockchain address format");
      return;
    }

    setAddressError("");

    if (recipientAddress.length < 10) {
      setComplianceData(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingCompliance(true);
      try {
        const response = await fetch("/api/compliance/screen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: recipientAddress,
            chain: "ARC-TESTNET",
          }),
        });
        const data: ComplianceCheckResponse = await response.json();
        setComplianceData(data);
      } catch {
        toast.error("Compliance check failed");
      } finally {
        setIsCheckingCompliance(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [recipientAddress]);

  const isBlocked = complianceData?.result === "FAIL";
  const needsReview = complianceData?.result === "REVIEW";

  const handleSend = async () => {
    if (!recipientName.trim()) {
      toast.error("Enter recipient name");
      return;
    }

    if (!recipientAddress || addressError) {
      toast.error("Enter a valid recipient wallet address");
      return;
    }

    if (parsedAed <= 0 || fees.recipientReceivesUsdc <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    if (isBlocked) {
      toast.error("Recipient address blocked by compliance screening");
      return;
    }

    if (needsReview && !showReviewWarning) {
      setShowReviewWarning(true);
      return;
    }

    setIsSending(true);
    setTrackingActive(true);
    setLastReceipt(null);

    try {
      const response = await fetch("/api/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientAddress,
          amount: fees.recipientReceivesUsdc.toFixed(2),
          destinationChain: corridor.destinationChain,
          sourceType: "gateway",
        }),
      });

      const data = await response.json();

      if (response.status === 202 && data.partialSuccess) {
        toast.warning("Fund your wallet to complete this remittance", {
          description: data.userMessage,
        });
        setTrackingActive(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.userMessage || data.error || "Remittance failed");
      }

      const receipt: RemittanceReceipt = {
        id: crypto.randomUUID(),
        corridorId,
        recipientName: recipientName.trim(),
        amountAed: parsedAed,
        amountUsdc: fees.sendAmountUsdc,
        recipientReceivesUsdc: fees.recipientReceivesUsdc,
        recipientAddress,
        createdAt: new Date().toISOString(),
        status: "CONFIRMED",
      };

      setLastReceipt(receipt);
      refreshGatewayBalance();
      refreshWalletBalance();

      toast.success(`Remittance to ${corridor.toCountry} initiated`, {
        description: `Settling $${fees.recipientReceivesUsdc.toFixed(2)} USDC on Arc`,
      });
    } catch (error) {
      setTrackingActive(false);
      toast.error("Remittance failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSending(false);
      setShowReviewWarning(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconWorld className="size-5 text-blue-500" />
            Send money from UAE
          </CardTitle>
          <CardDescription>
            Pay in AED, settle in USDC on Arc with sub-second confirmation. For educational and
            testnet demo purposes only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Destination corridor</Label>
            <Select value={corridorId} onValueChange={setCorridorId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REMITTANCE_CORRIDORS.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.flag} UAE → {c.toCountry}
                    {c.popular ? " · Popular" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount-aed">Amount (AED)</Label>
            <Input
              id="amount-aed"
              type="number"
              min={1}
              step={1}
              value={amountAed}
              onChange={(e) => setAmountAed(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              ≈ ${fees.sendAmountUsdc.toFixed(2)} USDC at demo rate {corridor.aedPerUsdc} AED/USDC
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient-name">Recipient name</Label>
            <Input
              id="recipient-name"
              placeholder="e.g. Priya Sharma"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient-address">Recipient Arc wallet address</Label>
            <Input
              id="recipient-address"
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className={`font-mono text-sm ${addressError ? "border-red-500" : ""}`}
            />
            {addressError && <p className="text-xs text-red-500">{addressError}</p>}
            {isCheckingCompliance && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <IconLoader2 className="size-3 animate-spin" />
                Screening recipient address...
              </div>
            )}
            {complianceData && !isCheckingCompliance && (
              <div className="flex items-center justify-between">
                <ComplianceStatusBadge result={complianceData.result} />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-xs"
                  onClick={() => setShowComplianceDetails(true)}
                >
                  View details
                </Button>
              </div>
            )}
          </div>

          <Alert>
            <Info className="size-4" />
            <AlertDescription className="text-xs">
              Gateway balance available: ${gatewayTotal.toFixed(2)} USDC · Settlement rail: Arc
              testnet (Chain ID 5042002)
            </AlertDescription>
          </Alert>

          {isBlocked && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertDescription className="text-xs">
                This recipient cannot receive funds due to compliance screening.
              </AlertDescription>
            </Alert>
          )}

          {needsReview && showReviewWarning && (
            <Alert>
              <Info className="size-4" />
              <AlertDescription className="text-xs">
                Recipient flagged for review. Confirm to proceed with testnet remittance.
              </AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={handleSend}
            disabled={
              isSending ||
              isBlocked ||
              !!addressError ||
              isCheckingCompliance ||
              !recipientAddress ||
              !recipientName.trim() ||
              parsedAed <= 0
            }
          >
            {isSending ? (
              <>
                <IconLoader2 className="size-4 animate-spin mr-2" />
                Sending remittance...
              </>
            ) : (
              <>
                <IconSend className="size-4 mr-2" />
                {needsReview && !showReviewWarning
                  ? "Review & send"
                  : `Send to ${corridor.toCountry}`}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <FeeBreakdownCard fees={fees} corridor={corridor} />

        <SettlementTracker
          active={trackingActive}
          onComplete={() => setTrackingActive(false)}
        />

        {lastReceipt && (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <IconReceipt className="size-4 text-green-600" />
                Remittance receipt
              </CardTitle>
              <CardDescription>
                {lastReceipt.recipientName} · {corridor.flag} {corridor.toCountry}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>
                Sent: {lastReceipt.amountAed.toFixed(2)} AED (${lastReceipt.amountUsdc.toFixed(2)}{" "}
                USDC)
              </p>
              <p className="font-medium text-green-600 dark:text-green-400">
                Received: ${lastReceipt.recipientReceivesUsdc.toFixed(2)} USDC on Arc
              </p>
              <p className="text-xs text-muted-foreground font-mono break-all">
                {lastReceipt.recipientAddress}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(lastReceipt.createdAt).toLocaleString()} · Status: {lastReceipt.status}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <ComplianceDetailsDialog
        open={showComplianceDetails}
        onOpenChange={setShowComplianceDetails}
        complianceData={complianceData}
        address={recipientAddress}
      />
    </div>
  );
}