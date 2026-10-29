import { api } from "@/lib/axios";
import { WalletResponse } from "../wallet/types/types";

/**
 * Fetch wallet details
 */
export async function getWalletDetails(
  walletId: string,
  includeTransactions: boolean = false,
): Promise<WalletResponse> {
  // Axios automatically appends baseURL (/api) -> /api/wallet/[walletId]
  const response = await api.get<WalletResponse>(
    `/wallet/${walletId}?transactions=${includeTransactions}`,
  );

  return response.data;
}

/**
 * Top up wallet API call
 */
export async function topUpWalletApi(walletId: string, amount: number) {
  const response = await api.post(`/wallet/topup`, {
    walletId,
    amount,
  });

  return response.data;
}
