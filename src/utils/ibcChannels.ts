export const ibcChannels: Record<string, Record<string, string>> = {
  "osmo-test-5": {
    "kaon-1": "channel-10",
  },
  "kaon-1": {
    "osmo-test-5": "channel-2",
  },
};
