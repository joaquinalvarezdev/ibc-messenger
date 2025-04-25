import { useState } from "react";

interface Props {
  chainIds: string[];
  setAddress: (chainId: string, address: string) => void;
}

export default function WalletConnect({ chainIds, setAddress }: Props) {
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      if (!window.keplr) {
        setError("Please install Keplr wallet extension");
        return;
      }

      for (const chainId of chainIds) {
        await window.keplr.enable(chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        setAddress(chainId, accounts[0].address);
      }

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to connect wallet. Check the console for details.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-2">
      <button
        onClick={connect}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
      >
        Connect Keplr Wallet
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
