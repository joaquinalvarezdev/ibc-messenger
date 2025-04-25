import { useState } from "react";
import { CHAINS } from "../utils/chains";

interface Props {
  address: string | null;
  chainId: string;
  label: string;
}

export default function AddressDisplay({ address, chainId, label }: Props) {
  const [copied, setCopied] = useState(false);

  const chain = CHAINS.find((c) => c.chainId === chainId);
  const icon = chain ? `/icons/${chain.prefix}.png` : null;

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;

  if (!address) return null;

  return (
    <div className="text-xs text-center text-green-400 font-mono mt-2">
      <span className="text-gray-400">{label}:</span>
      <div className="flex items-center gap-2 justify-center mt-1">
        {icon && <img src={icon} alt="icon" className="w-4 h-4" />}
        <span>{shortAddress}</span>
        <button onClick={handleCopy} className="text-blue-400 hover:underline">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
