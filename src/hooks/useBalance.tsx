import { useEffect, useState } from "react";
import { getBalance } from "../services/balanceService";

export function useBalance(rpcEndpoint: string, address: string, denom: string) {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !rpcEndpoint || !denom) return;

    const fetchBalance = async () => {
      setLoading(true);
      try {
        const result = await getBalance(rpcEndpoint, address, denom);
        setBalance(result);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [rpcEndpoint, address, denom]);

  const numeric = balance ? parseFloat(balance) / 1_000_000 : 0;

  return {
    balance: numeric.toFixed(6),
    loading,
    error,
    raw: balance,
  };
}
