import type { RemittanceCorridor } from "@/lib/constants/remittance-corridors";

export type FeeBreakdown = {
  sendAmountAed: number;
  sendAmountUsdc: number;
  platformFeeUsdc: number;
  networkFeeUsdc: number;
  bridgeFeeUsdc: number;
  totalFeesUsdc: number;
  recipientReceivesUsdc: number;
  traditionalFeeAed: number;
  savingsAed: number;
  savingsPercent: number;
};

const ARC_NETWORK_FEE_USDC = 0.01;
const CROSS_CHAIN_BRIDGE_FEE_USDC = 0.5;

export function aedToUsdc(aed: number, aedPerUsdc: number): number {
  if (aed <= 0 || aedPerUsdc <= 0) return 0;
  return aed / aedPerUsdc;
}

export function usdcToAed(usdc: number, aedPerUsdc: number): number {
  return usdc * aedPerUsdc;
}

export function calculateFeeBreakdown(
  amountAed: number,
  corridor: RemittanceCorridor,
  options?: { isCrossChain?: boolean }
): FeeBreakdown {
  const isCrossChain = options?.isCrossChain ?? true;
  const sendAmountUsdc = aedToUsdc(amountAed, corridor.aedPerUsdc);
  const platformFeeUsdc = corridor.platformFeeUsdc;
  const networkFeeUsdc = ARC_NETWORK_FEE_USDC;
  const bridgeFeeUsdc = isCrossChain ? CROSS_CHAIN_BRIDGE_FEE_USDC : 0;
  const totalFeesUsdc = platformFeeUsdc + networkFeeUsdc + bridgeFeeUsdc;
  const recipientReceivesUsdc = Math.max(0, sendAmountUsdc - totalFeesUsdc);

  const traditionalFeeAed = amountAed * (corridor.traditionalFeePercent / 100);
  const ourTotalFeeAed = usdcToAed(totalFeesUsdc, corridor.aedPerUsdc);
  const savingsAed = Math.max(0, traditionalFeeAed - ourTotalFeeAed);
  const savingsPercent =
    traditionalFeeAed > 0 ? (savingsAed / traditionalFeeAed) * 100 : 0;

  return {
    sendAmountAed: amountAed,
    sendAmountUsdc,
    platformFeeUsdc,
    networkFeeUsdc,
    bridgeFeeUsdc,
    totalFeesUsdc,
    recipientReceivesUsdc,
    traditionalFeeAed,
    savingsAed,
    savingsPercent,
  };
}