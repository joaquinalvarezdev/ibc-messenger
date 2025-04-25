export const isChainAvailable = async (chainId: string): Promise<boolean> => {
  try {
    await window.keplr?.enable(chainId);
    return true;
  } catch {
    return false;
  }
};
