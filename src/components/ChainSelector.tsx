import { CHAINS, ChainOption } from "../utils/chains";

interface Props {
  label: string;
  value: string;
  onChange: (chainId: string) => void;
}

export default function ChainSelector({ label, value, onChange }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 w-64"
      >
        {CHAINS.map((chain) => (
          <option key={chain.chainId} value={chain.chainId}>
            {chain.name}
          </option>
        ))}
      </select>
    </div>
  );
}
