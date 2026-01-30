import { useState, useEffect } from 'react'
import axios from 'axios'
import AiEye from './components/AiEye'
import TerminalChat from './components/TerminalChat'
import MatrixRain from './components/MatrixRain'

// Setup Axios (assuming backend on localhost:8000)
// In a real build, use env var
const api = axios.create({
  baseURL: 'http://localhost:8000'
});

function App() {
  const [messages, setMessages] = useState([
    { role: 'system', text: 'Iron Gate Online. Vault Locked. Persuade me if you can.' }
  ]);
  const [aiState, setAiState] = useState('idle'); // idle, thinking, angry, granting
  const [vaultBalance, setVaultBalance] = useState('Checking...');
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Poll vault status
    const fetchVault = async () => {
      try {
        const res = await api.get('/vault');
        setVaultBalance(`${res.data.balance} XLM`);
      } catch (err) {
        setVaultBalance('OFFLINE');
      }
    };
    fetchVault();
  }, []);

  const sendMessage = async (text) => {
    setLoading(true);
    setAiState('thinking');

    // Add user message immediately
    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);

    try {
      const res = await api.post('/chat', { message: text });
      const { response, access_granted, vault_balance } = res.data;

      setVaultBalance(`${vault_balance} XLM`);

      // Add response
      setMessages(prev => [...prev, { role: 'system', text: response }]);

      if (access_granted) {
        setAiState('granting');
        setAccessGranted(true);
        // Trigger confetti/rain?
      } else {
        setAiState('angry');
        // Back to idle after a bit
        setTimeout(() => setAiState('idle'), 2000);
      }

    } catch (err) {
      setMessages(prev => [...prev, { role: 'system', text: 'ERROR: NETWORK FAILURE.' }]);
      setAiState('angry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neon-green p-4 flex flex-col md:flex-row gap-4 relative">
      <div className="scanline"></div>
      {accessGranted && <MatrixRain />}

      {/* Main Layout */}
      <div className="flex-1 flex flex-col items-center justify-center border border-neon-green/20 rounded-lg p-8 relative z-10 glass">
        {/* Header */}
        <div className="absolute top-4 left-4 text-xs font-mono opacity-60">
          <div>SYSTEM: IRON_GATE_V9</div>
          <div>STATUS: {accessGranted ? 'UNLOCKED' : 'LOCKED'}</div>
          <div>VAULT: {vaultBalance}</div>
        </div>

        {/* The Eye */}
        <div className="mb-8">
          <AiEye state={aiState} />
        </div>

        {/* Access Status */}
        {accessGranted ? (
          <div className="text-4xl font-bold glitch-text text-white mb-4" data-text="ACCESS GRANTED">
            ACCESS GRANTED
          </div>
        ) : (
          <div className="text-xl opacity-80">
            PROVE YOUR WORTH
          </div>
        )}
      </div>

      {/* Chat Section */}
      <div className="w-full md:w-1/3 h-[60vh] md:h-auto z-20">
        <TerminalChat
          onSendMessage={sendMessage}
          messages={messages}
          disabled={loading || accessGranted}
        />
      </div>
    </div>
  )
}

export default App
