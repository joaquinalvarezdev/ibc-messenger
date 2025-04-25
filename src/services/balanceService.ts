import { StargateClient } from "@cosmjs/stargate";

export async function getBalance(
  rpcEndpoint: string,
  address: string,
  denom: string
): Promise<string> {
  const client = await StargateClient.connect(rpcEndpoint);
  const balance = await client.getBalance(address, denom);
  return balance.amount; // amount is in uosmo, uatom, etc.
}
