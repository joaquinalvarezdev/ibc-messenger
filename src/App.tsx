import WalletConnect from "./components/WalletConnect";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">IBC Messenger</h1>
      <WalletConnect />
    </div>
  );
}
