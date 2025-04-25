import { useState } from "react";

interface Props {
  chainId: string;
}

export default function WalletConnect({ chainId }: Props) {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      if (!window.keplr) {
        setError("Please install Keplr wallet extension");
        return;
      }

      await window.keplr.enable(chainId);
      const offlineSigner = window.keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();

      setAddress(accounts[0].address);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to connect wallet. Check the console for details.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      {address ? (
        <p className="text-green-400 font-mono">Address: {address}</p>
      ) : (
        <button
          onClick={connect}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Connect Keplr Wallet
        </button>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
