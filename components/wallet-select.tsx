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

"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBalanceContext } from "@/lib/contexts/balance-context"

export type WalletOption = {
  id: string
  address: string
  circle_wallet_id: string
  blockchain: string
  name: string
  type?: string
}

interface WalletSelectProps {
  value?: string
  onValueChange: (value: string) => void
  onSelectWallet?: (wallet: WalletOption) => void
  disabled?: boolean
  placeholder?: string
  chainFilter?: string
  excludeChain?: string
  excludeAddress?: string
  excludeGatewaySigner?: boolean
  excludeArcWallets?: boolean
  minBalance?: number
}

export function WalletSelect({
  value,
  onValueChange,
  onSelectWallet,
  disabled,
  placeholder = "Select a wallet",
  chainFilter,
  excludeChain,
  excludeAddress,
  excludeGatewaySigner = false,
  excludeArcWallets = false,
  minBalance,
}: WalletSelectProps) {
  const { wallets, walletBalances, walletsReady, refreshWalletBalance } =
    useBalanceContext()

  // Refresh balances when the select opens so minBalance filters stay accurate
  React.useEffect(() => {
    if (walletsReady && wallets.length > 0) {
      void refreshWalletBalance()
    }
  }, [walletsReady, wallets.length, refreshWalletBalance])

  const displayedWallets = React.useMemo(() => {
    let result: WalletOption[] = wallets.map((wallet) => ({
      id: wallet.id,
      address: wallet.address,
      circle_wallet_id: wallet.circle_wallet_id,
      blockchain: wallet.blockchain,
      name: wallet.name ?? "Wallet",
      type: wallet.type,
    }))

    if (chainFilter) {
      result = result.filter((w) => w.blockchain === chainFilter)
    }

    if (excludeChain) {
      result = result.filter((w) => w.blockchain !== excludeChain)
    }

    if (excludeAddress) {
      result = result.filter((w) => w.address !== excludeAddress)
    }

    if (excludeGatewaySigner) {
      result = result.filter((w) => w.type !== "gateway_signer")
    }

    if (excludeArcWallets) {
      result = result.filter((w) => w.blockchain !== "ARC-TESTNET")
    }

    if (minBalance !== undefined) {
      result = result.filter((w) => {
        const balanceStr = walletBalances[w.circle_wallet_id]
        if (!balanceStr) return false
        const numericPart = balanceStr.split(" ")[0].replace(/[$,]/g, "")
        const balance = parseFloat(numericPart)
        return !isNaN(balance) && balance > minBalance
      })
    }

    const seen = new Set<string>()
    result = result.filter((wallet) => {
      const key = `${wallet.address.toLowerCase()}-${wallet.blockchain.toLowerCase()}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    return result
  }, [
    wallets,
    chainFilter,
    excludeChain,
    excludeAddress,
    excludeGatewaySigner,
    excludeArcWallets,
    minBalance,
    walletBalances,
  ])

  const isLoading = !walletsReady

  const formatChainName = (chain: string) => {
    return chain
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  return (
    <Select
      value={value}
      onValueChange={(val) => {
        onValueChange(val)

        if (onSelectWallet) {
          const selected = displayedWallets.find(
            (w) => `${w.address}-${w.blockchain}` === val
          )
          if (selected) {
            onSelectWallet(selected)
          }
        }
      }}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? "Loading wallets..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {displayedWallets.map((wallet) => (
          <SelectItem
            key={wallet.id}
            value={`${wallet.address}-${wallet.blockchain}`}
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <span className="font-mono text-sm">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </span>
              <span className="text-muted-foreground text-xs truncate max-w-[200px]">
                {wallet.name} ({formatChainName(wallet.blockchain)})
                {walletBalances[wallet.circle_wallet_id] &&
                  ` - ${walletBalances[wallet.circle_wallet_id].split(" ")[0]}`}
              </span>
            </div>
          </SelectItem>
        ))}
        {!isLoading && displayedWallets.length === 0 && (
          <div className="p-2 text-sm text-muted-foreground text-center">
            No available wallets
          </div>
        )}
      </SelectContent>
    </Select>
  )
}