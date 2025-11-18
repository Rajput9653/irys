
import React, { useState, useCallback } from 'react';
import { generateAirdropMessage } from './services/geminiService';
import { WalletIcon } from './components/icons/WalletIcon';
import { TwitterIcon } from './components/icons/TwitterIcon';
import { DiscordIcon } from './components/icons/DiscordIcon';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [discordRoles, setDiscordRoles] = useState('');
  
  const [airdropValue, setAirdropValue] = useState<number | null>(null);
  const [geminiMessage, setGeminiMessage] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!walletAddress) {
      setError('Wallet address is required to check eligibility.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAirdropValue(null);
    setGeminiMessage('');

    try {
      // Simulate airdrop value calculation
      let calculatedValue = 500; // Base value
      if (walletAddress.length > 10) calculatedValue += 500;
      if (twitterHandle.trim()) calculatedValue += 750;
      const roles = discordRoles.split(',').filter(role => role.trim() !== '');
      calculatedValue += roles.length * 250;
      
      // Add some randomness
      calculatedValue += Math.floor(Math.random() * 500);

      const message = await generateAirdropMessage(calculatedValue, discordRoles);
      
      setAirdropValue(calculatedValue);
      setGeminiMessage(message);

    } catch (e) {
      console.error(e);
      setError('An error occurred while checking eligibility. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, twitterHandle, discordRoles]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono flex flex-col items-center justify-center p-4 selection:bg-purple-500 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <main className="relative z-10 w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Irys XYZ
          </h1>
          <p className="text-gray-400 mt-2">Airdrop Eligibility Checker</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 md:p-8 shadow-2xl shadow-purple-900/20">
          {!airdropValue && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="walletAddress" className="text-sm font-medium text-gray-400 flex items-center mb-2">
                    <WalletIcon className="h-4 w-4 mr-2" />
                    Wallet Address
                  </label>
                  <input
                    id="walletAddress"
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="twitterHandle" className="text-sm font-medium text-gray-400 flex items-center mb-2">
                    <TwitterIcon className="h-4 w-4 mr-2" />
                    Twitter Handle (Optional)
                  </label>
                  <input
                    id="twitterHandle"
                    type="text"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    placeholder="@your_handle"
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="discordRoles" className="text-sm font-medium text-gray-400 flex items-center mb-2">
                    <DiscordIcon className="h-4 w-4 mr-2" />
                    Discord Roles (Optional, comma-separated)
                  </label>
                  <input
                    id="discordRoles"
                    type="text"
                    value={discordRoles}
                    onChange={(e) => setDiscordRoles(e.target.value)}
                    placeholder="OG, Contributor, Moderator"
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
              
              {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-bold py-3 rounded-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                {isLoading ? <Spinner /> : 'Check Eligibility'}
              </button>
            </form>
          )}

          {isLoading && !airdropValue && (
            <div className="flex flex-col items-center justify-center p-8">
              <Spinner />
              <p className="mt-4 text-gray-400">Analyzing on-chain data...</p>
            </div>
          )}

          {airdropValue !== null && !isLoading && (
            <div className="text-center animate-fade-in">
              <h2 className="text-lg text-gray-300">Potential Airdrop Allocation</h2>
              <p className="text-5xl font-bold my-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-teal-400 to-blue-500">
                {airdropValue.toLocaleString()} IRYS
              </p>
              <p className="text-gray-400 italic">
                {geminiMessage}
              </p>
              <button
                onClick={() => {
                    setAirdropValue(null);
                    setGeminiMessage('');
                    setWalletAddress('');
                    setTwitterHandle('');
                    setDiscordRoles('');
                }}
                className="w-full mt-8 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-md transition-all duration-300"
              >
                Check Another Wallet
              </button>
            </div>
          )}
        </div>
        <footer className="text-center mt-8">
            <p className="text-xs text-gray-600">Note: This is a simulation. Airdrop values are not final.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
