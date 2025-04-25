import { useState } from "react";
import { sendIbcTokens } from "../services/ibcService";

interface TransferParams {
  senderAddress: string;
  recipientAddress: string;
  amount: string;
  denom: string;
  sourceChainId: string;
  rpcEndpoint: string;
  sourceChannel: string;
  memo?: string;
}

export function useIbcTransfer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const transfer = async (params: TransferParams) => {
    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const hash = await sendIbcTokens(params);
      setTxHash(hash);
    } catch (err: any) {
      console.error("IBC transfer failed:", err);
      setError(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    transfer,
    loading,
    error,
    txHash,
  };
}