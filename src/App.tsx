import { useState } from "react";
import ChainSelector from "./components/ChainSelector";
import WalletConnect from "./components/WalletConnect";
import SuggestChainButton from "./components/SuggestChainButton";
import { CHAINS } from "./utils/chains";

export default function App() {
  const [sourceChain, setSourceChain] = useState("osmo-test-5");
  const [targetChain, setTargetChain] = useState("elgafar-1");
  const [showSetupModal, setShowSetupModal] = useState(false);
  const sourceInfo = CHAINS.find((c) => c.chainId === sourceChain);
  const tokenDenom = sourceInfo?.denom.replace("u", "").toUpperCase();
  const [amount, setAmount] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">IBC Messenger</h1>

        <ChainSelector label="Source Chain" value={sourceChain} onChange={setSourceChain} />
        <ChainSelector label="Target Chain" value={targetChain} onChange={setTargetChain} />

        <div className="mt-4">
          <label className="text-sm mb-1 block text-gray-300">Amount to transfer</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-900 border border-gray-600 text-white px-3 py-2 rounded w-full"
              placeholder="0.0"
            />
            <span className="text-white font-medium">{tokenDenom || "TOKEN"}</span>
          </div>
        </div>

        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition">
          Transfer
        </button>

        <div className="flex justify-between mt-4 gap-2">
          <button
            onClick={() => setShowSetupModal(true)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
          >
            🛠️ Setup Supported Chains
          </button>
          <div className="w-full">
            <WalletConnect chainId={sourceChain} />
          </div>
        </div>
      </div>

      {showSetupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-80 border border-gray-600">
            <h2 className="text-xl font-semibold mb-4 text-center">Setup Chains</h2>
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
