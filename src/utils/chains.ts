export interface ChainOption {
  name: string;
  chainId: string;
  rpc: string;
  rest: string;
  denom: string;
  prefix: string;
}

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
    name: "Kyve Kaon Testnet",
    chainId: "kaon-1",
    rpc: "https://rpc.testcosmos.directory/kyvetestnet",
    rest: "https://rest.testcosmos.directory/kyvetestnet",
    denom: "tkyve",
    prefix: "kyve",
  },
];
