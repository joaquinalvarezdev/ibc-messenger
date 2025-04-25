/// <reference types="@keplr-wallet/types" />

import type { Keplr, OfflineSigner } from "@keplr-wallet/types";

declare global {
  interface Window {
    keplr?: Keplr;
    getOfflineSigner?: (chainId: string) => OfflineSigner;
    getEnigmaUtils?: (chainId: string) => any;
  }
}
