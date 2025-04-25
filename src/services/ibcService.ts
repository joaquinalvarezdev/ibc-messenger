import { assertIsDeliverTxSuccess, SigningStargateClient } from "@cosmjs/stargate";
import { MsgTransfer } from "cosmjs-types/ibc/applications/transfer/v1/tx";
import { EncodeObject } from "@cosmjs/proto-signing";

interface SendIbcTokensParams {
  senderAddress: string;
  recipientAddress: string;
  amount: string;
  denom: string;
  sourceChainId: string;
  rpcEndpoint: string;
  sourceChannel: string;
  memo?: string;
}

export async function sendIbcTokens({
  senderAddress,
  recipientAddress,
  amount,
  denom,
  sourceChainId,
  rpcEndpoint,
  sourceChannel,
  memo = "",
}: SendIbcTokensParams): Promise<string> {
  if (!window.keplr) throw new Error("Keplr extension is not available");
  await window.keplr.enable(sourceChainId);
  const offlineSigner = window.keplr.getOfflineSigner(sourceChainId);
  if (!offlineSigner) throw new Error("Failed to get offline signer from Keplr");

  const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, offlineSigner);

  const timeoutTimestamp = BigInt(Date.now() + 60_000) * BigInt(1_000_000); // 60s in nanoseconds

  const msg: MsgTransfer = {
    sourcePort: "transfer",
    sourceChannel,
    token: {
      denom,
      amount,
    },
    memo: "",
    sender: senderAddress,
    receiver: recipientAddress,
    timeoutHeight: {
        revisionNumber: BigInt(0),
        revisionHeight: BigInt(0),
    },
    timeoutTimestamp: timeoutTimestamp,
  };

  const msgAny: EncodeObject = {
    typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
    value: msg,
  };

  const fee = {
    amount: [
      {
        denom,
        amount: "2000",
      },
    ],
    gas: "200000",
  };

  const result = await client.signAndBroadcast(senderAddress, [msgAny], fee, memo);
  assertIsDeliverTxSuccess(result);
  return result.transactionHash;
}
