import { useState } from "react";
import ChainSelector from "./components/ChainSelector";
import WalletConnect from "./components/WalletConnect";
import { useBalance } from "./hooks/useBalance";
import SuggestChainButton from "./components/SuggestChainButton";
import AddressDisplay from "./components/AddressDisplay";
import { CHAINS } from "./utils/chains";
import { ibcChannels } from "./utils/ibcChannels";
import { sendIbcTokens } from "./services/ibcService";

export default function App() {
  const [sourceChain, setSourceChain] = useState(CHAINS.at(0)?.chainId || "osmo-test-5");
  const [targetChain, setTargetChain] = useState(CHAINS.at(1)?.chainId || "elgafar-1");
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [addresses, setAddresses] = useState<Record<string, string>>({});
  const [isTransferring, setIsTransferring] = useState(false);

  const sourceInfo = CHAINS.find((c) => c.chainId === sourceChain);
  const sourceAddress = addresses[sourceChain] ?? "";
  const tokenDenom = sourceInfo?.denom.replace("u", "").toUpperCase();

  const handleSetAddress = (chainId: string, addr: string) => {
    setAddresses((prev) => ({ ...prev, [chainId]: addr }));
  };

  const { balance, loading: loadingBalance } = useBalance(
    sourceInfo?.rpc || "",
    sourceAddress,
    sourceInfo?.denom || ""
  );

  const handleTransfer = async () => {
    setIsTransferring(true);
    const sourceAddr = addresses[sourceChain];
    const targetAddr = addresses[targetChain];
    const sourceInfo = CHAINS.find((c) => c.chainId === sourceChain);
    const channel = ibcChannels[sourceChain]?.[targetChain];

    if (!sourceAddr || !targetAddr || !sourceInfo || !channel) {
      alert("Missing info for transfer.");
      return;
    }

    try {
      const txHash = await sendIbcTokens({
        senderAddress: sourceAddr,
        recipientAddress: targetAddr,
        amount: (parseFloat(amount) * 1_000_000).toString(),
        denom: sourceInfo.denom,
        sourceChainId: sourceInfo.chainId,
        rpcEndpoint: sourceInfo.rpc,
        sourceChannel: channel,
      });

      setTxHash(txHash);
    } catch (err) {
      console.error("❌ Transfer failed:", err);
      alert("❌ Transfer failed. Check console.");
    } finally {
      setIsTransferring(false);
    }
  };

  const bothConnected = addresses[sourceChain] && addresses[targetChain];
  const isValidAmount = !!amount && !isNaN(Number(amount)) && Number(amount) > 0;
  const isSameChain = sourceChain === targetChain;
  const hasEnoughBalance = parseFloat(amount) <= parseFloat(balance);
  const canTransfer = bothConnected && isValidAmount && !isSameChain && hasEnoughBalance;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">IBC Messenger</h1>

        <ChainSelector label="Source Chain" value={sourceChain} onChange={setSourceChain} />
        <ChainSelector label="Target Chain" value={targetChain} onChange={setTargetChain} />

        <div className="mt-4">
          <label className="text-sm mb-1 block text-gray-300">Amount to transfer</label>
          <div className="relative flex items-center">
            <input
              inputMode="decimal"
              type="text"
              value={amount}
              onChange={(e) => {
                const raw = e.target.value;
                if (/^\d*\.?\d*$/.test(raw)) setAmount(raw);
              }}
              className="bg-gray-900 border border-gray-600 text-white placeholder-gray-500 px-3 py-3 pr-20 rounded w-full text-lg font-semibold appearance-none"
              placeholder="0.00"
            />
            <span className="absolute right-4 text-white text-sm font-semibold">
              {tokenDenom || "TOKEN"}
            </span>
          </div>

          <p className="text-xs text-gray-400 mt-1">
            {loadingBalance ? "Checking balance..." : `Available: ${balance} ${tokenDenom}`}
          </p>

          <div className="text-xs mt-1 space-y-1">
            {!isValidAmount && amount !== "" && (
              <p className="text-red-500">Enter a valid amount greater than 0</p>
            )}
            {isSameChain && (
              <p className="text-red-500">Source and target chains must be different</p>
            )}
            {isValidAmount && !hasEnoughBalance && (
              <p className="text-red-500">Insufficient balance to transfer this amount</p>
            )}
          </div>
        </div>

        <button
          className={`mt-6 w-full py-3 rounded-lg transition text-lg font-semibold ${
            canTransfer && !isTransferring
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!canTransfer || loadingBalance || isTransferring}
          onClick={handleTransfer}
        >
          <span className="flex items-center justify-center gap-2">
            {isTransferring ? (
              <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                />
              </svg>
            ) : (
              <span className="text-xl">➡</span>
            )}
            {isTransferring ? "Transferring..." : "Transfer"}
          </span>
        </button>

        {txHash && (
          <div className="mt-4 text-sm bg-gray-700 text-green-400 rounded p-3 break-all">
            ✅ Transfer successful!
            <br />
            Tx Hash: <span className="font-mono">{txHash}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(txHash);
              }}
              className="ml-2 text-blue-300 hover:underline"
            >
              📋
            </button>
          </div>
        )}

        <div className="mt-6 border-t border-gray-700 pt-4 flex flex-col gap-3 items-center text-sm">
          <button
            onClick={() => setShowSetupModal(true)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded"
          >
            🛠️ Setup Supported Chains
          </button>

          <AddressDisplay
            address={addresses[sourceChain]}
            chainId={sourceChain}
            label="From Address"
          />
          <AddressDisplay
            address={addresses[targetChain]}
            chainId={targetChain}
            label="To Address"
          />
        </div>

        <div className="w-full mt-4">
          {bothConnected ? (
            <button className="w-full bg-emerald-600 text-white py-3 rounded-lg opacity-90 cursor-default text-lg font-semibold">
              ✅ Wallet Connected
            </button>
          ) : (
            <WalletConnect chainIds={[sourceChain, targetChain]} setAddress={handleSetAddress} />
          )}
        </div>
      </div>

      {showSetupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-80 border border-gray-600">
            <h2 className="text-xl font-semibold mb-4 text-center">Setup Chains on Keplr Wallet</h2>
            {CHAINS.map((chain) => (
              <div key={chain.chainId} className="mb-2">
                <SuggestChainButton chain={chain} />
              </div>
            ))}
            <button
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => setShowSetupModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
