# IBC Messenger

**IBC Messenger** is a lightweight web client for performing IBC token transfers using [Keplr Wallet](https://www.keplr.app/).  
It provides a user-friendly interface to transfer tokens between Cosmos chains.

By default, it's preconfigured to use the [Juno Testnet](https://testnet.cosmos.directory/junotestnet) and [Osmosis Testnet](https://testnet.cosmos.directory/osmosistestnet), but it can be easily extended to support other Cosmos SDK-based chains.

---

## Requirements

- [Node.js & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Keplr Wallet browser extension (installed and set up)

---

## Get Started

Clone the repo and install dependencies:

```bash
npm install

Start the local dev server:

npm run dev
```

App should be available at `http://localhost:5173`

## Configuration

To add or change supported chains:

Edit the CHAINS array inside `utils/chains.ts` and the corresponding IBC channel mappings in `ibcChannels.ts` if applicable.

Example:


```typescript 
export const CHAINS: ChainOption[] = [
  {
    name: "Osmosis Testnet",
    chainId: "osmo-test-5",
    rpc: "https://rpc.testnet.osmosis.zone",
    rest: "https://lcd.testnet.osmosis.zone",
    denom: "uosmo",
    prefix: "osmo",
  },
  {
    name: "Juno Testnet",
    chainId: "uni-7",
    rpc: "https://rpc.testcosmos.directory/junotestnet",
    rest: "https://rest.testcosmos.directory/junotestnet",
    denom: "ujunox",
    prefix: "juno",
  },
];
```

--- 
Usefull links

* [Osmosis Faucet](https://faucet.testnet.osmosis.zone/)
* [Juno Faucet (Discord)](https://discord.com/invite/KEjGm5fPB3)
* [Testnet Cosmos Directory](https://testnet.cosmos.directory/)
* [Cosmos IBC Testnets registry](https://github.com/cosmos/chain-registry/tree/master/testnets/_IBC)

