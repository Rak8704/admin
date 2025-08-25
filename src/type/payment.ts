// Import the specific types we need directly from the generated client
import type { Decimal } from '@prisma/client/runtime/library';


// Define enums
export enum PaymentWalletType {
  EWALLET = "EWALLET",
  BANK = "BANK",
  CARD = "CARD",
  CRYPTO = "CRYPTO"
}

export enum DepositStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum WithdrawStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum ManagementRole {
  ADMIN = "ADMIN",
  SUBADMIN = "SUBADMIN"
}

// Define model types
export type PaymentWallet = {
  id: string;
  walletLogo: string;
  walletName: string;
  walletType: PaymentWalletType;
}

export type DepositWallet = {
  id: string;
  paymentWalletId: string;
  walletsNumber: string[];
  instructions: string;
  warning: string | null;
  trxType: string;
  minDeposit: Decimal;
  maximumDeposit: Decimal;
  isActive: boolean;
}

export type Deposit = {
  id: string;
  amount: Decimal;
  bonus: Decimal | null;
  bonusFor: string;
  senderNumber: string;
  trxID: string | null;
  walletId: string;
  walletNumber: string;
  trackingNumber: string;
  expire: Date;
  status: DepositStatus;
  userId: string;
  createdAt: Date;
}

export type Card = {
  id: string;
  cardNumber: string;
  walletNumber: string;
  paymentWalletid: string;
  containerId: string;
  isActive: boolean;
  createdAt: Date;
}

export type Withdraw = {
  id: string;
  amount: Decimal;
  expire: Date;
  status: WithdrawStatus;
  createdAt: Date;
  cardId: string;
  userId: string;
}

export type Admin = {
  id: string;
  name: string;
  role: ManagementRole;
  email: string;
  password: string;
}

// Define extended types for the frontend
export type ExtenedDepositWallet = DepositWallet & {
  paymentWallet: PaymentWallet;
};

export type ExtenedDeposit = Deposit & {
  wallet: ExtenedDepositWallet;
  user: {
    playerId: string;
    phone: string;
  };
};

export type ExtenedWithdraw = Withdraw & {
  card: Card & {
    paymentWallet: PaymentWallet;
    container: {
      ownerName: string;
    };
  };
  user: {
    playerId: string;
    phone: string;
  };
};

// Define input/output types for API calls
export type DepositApprovalInput = {
  depositId: string;
  actionType: "approve" | "reject";
  message?: string;
};

export type DepostisFetchInput = {
  search: string;
  from: string;
  to: string;
  gateway: string;
  minAmount: number;
  maxAmount: number;
  status: string;
  limit: number;
  page: number;
};

export type DepostisFetchOutput = {
  success: boolean;
  data: {
    deposits: ExtenedDeposit[];
    totalFound: number;
    limit: number;
    paymentWallets: PaymentWallet[];
  };
};

export type WalletCreateInput = {
  walletLogo: string;
  walletName: string;
  walletType: PaymentWalletType;
  wallets: string[];
  isActive: boolean;
};

export type WalletFetchOutput = {
  data: {
    wallets: (DepositWallet & { paymentWallet: PaymentWallet })[];
  };
};

export type WalletUpdateInput = {
  id: string;
  maxDeposit: number;
  minDeposit: number;
  trxType: string;
  instructions: string;
  isActive: boolean;
  wallets: string[];
  warning: string;
};

export type WithdrawApprovalInput = {
  withdrawId: string;
  actionType: "approve" | "reject";
  message?: string;
};

export type WithdrawsFetchInput = {
  search: string;
  from: string;
  to: string;
  card: string;
  minAmount: number;
  maxAmount: number;
  status: string;
  limit: number;
  page: number;
};

export type WithdrawsFetchOutput = {
  success: boolean;
  data: {
    withdraws: ExtenedWithdraw[];
    totalFound: number;
    limit: number;
    paymentWallets: PaymentWallet[];
  };
};
