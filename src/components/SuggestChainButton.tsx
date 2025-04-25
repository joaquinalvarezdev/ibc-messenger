import { useState, useEffect } from "react";
import { ChainOption } from "../utils/chains";
import { isChainAvailable } from "../utils/keplr";

interface Props {
  chain: ChainOption;
}

export default function SuggestChainButton({ chain }: Props) {
  const [alreadyAdded, setAlreadyAdded] = useState(false);

  useEffect(() => {
    isChainAvailable(chain.chainId).then(setAlreadyAdded);
  }, [chain.chainId]);

  const suggestChain = async () => {
    if (!window.keplr || !window.keplr.experimentalSuggestChain) {
      alert("Keplr extension not found or does not support chain suggestion.");
      return;
    }

    try {
      await window.keplr.experimentalSuggestChain({
        chainId: chain.chainId,
        chainName: chain.name,
        rpc: chain.rpc,
        rest: chain.rest,
        bip44: { coinType: 118 },
        bech32Config: {
          bech32PrefixAccAddr: chain.prefix,
          bech32PrefixAccPub: `${chain.prefix}pub`,
          bech32PrefixValAddr: `${chain.prefix}valoper`,
          bech32PrefixValPub: `${chain.prefix}valoperpub`,
          bech32PrefixConsAddr: `${chain.prefix}valcons`,
          bech32PrefixConsPub: `${chain.prefix}valconspub`,
        },
        currencies: [
          {
            coinDenom: chain.prefix.toUpperCase(),
            coinMinimalDenom: chain.denom,
            coinDecimals: 6,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: chain.prefix.toUpperCase(),
            coinMinimalDenom: chain.denom,
            coinDecimals: 6,
            gasPriceStep: {
              low: 0.01,
              average: 0.025,
              high: 0.04,
            },
          },
        ],
        stakeCurrency: {
          coinDenom: chain.prefix.toUpperCase(),
          coinMinimalDenom: chain.denom,
          coinDecimals: 6,
        },
        features: ["stargate", "ibc-transfer"],
      });

      alert(`✅ ${chain.name} added to Keplr!`);
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to add ${chain.name}. See console.`);
    }
  };

  return alreadyAdded ? (
    <p className="text-green-400 text-sm text-center">✅ {chain.name} already added</p>
  ) : (
    <button
      onClick={suggestChain}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition"
    >
      Add {chain.name} to Keplr
    </button>
  );
}
