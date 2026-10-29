export interface TransactionTypes {
  id: string;
  amount: number;
  type: string;
  createdAt?: string;
}

export interface WalletData {
  id?: string;
  walletBalance: number;
  walletTransactions?: TransactionTypes[];
}

export interface WalletBalanceCardProps {
  type?: "wallet" | "Badge";
  walletData?: WalletData | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  onTopUp?: () => void;
}

export interface WalletResponse {
  success: boolean;
  message: string;
  walletData: {
    id: string;
    walletBalance: number;
    walletTransactions?: Array<{
      id: string;
      amount: number;
      type: string;
      createdAt?: string;
    }>;
  };
}
