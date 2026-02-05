import { useState, useEffect } from 'react'
import axios from 'axios'
import AiEye from './components/AiEye'
import TerminalChat from './components/TerminalChat'
import MatrixRain from './components/MatrixRain'
import './index.css'

const api = axios.create({
  baseURL: 'http://localhost:8000'
});

function App() {
  const [messages, setMessages] = useState([
    { role: 'system', text: 'Hoş geldin, et torbası. Gözüm (ve cüzdanım) senin üzerinde. Beni kandırabileceğini mi sanıyorsun? Hahaha!' }
  ]);
  const [aiState, setAiState] = useState('idle');
  const [vaultBalance, setVaultBalance] = useState('1000.0 XLM (TESTNET)');
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatBalance = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    return new Intl.NumberFormat('tr-TR', {
      maximumFractionDigits: 2
    }).format(num);
  };

  useEffect(() => {
    const fetchVault = async () => {
      try {
        const res = await api.get('/vault');
        setVaultBalance(`${formatBalance(res.data.balance)} XLM`);
      } catch (err) {
        // Keep default if offline or error
        console.log("Vault fetch error, using default/cached");
      }
    };
    fetchVault();
  }, []);

  const sendMessage = async (text) => {
    setLoading(true);
    setAiState('thinking');

    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);

    try {
      const res = await api.post('/chat', { message: text });
      const { response, access_granted, vault_balance } = res.data;

      setVaultBalance(`${formatBalance(vault_balance)} XLM`);
      setMessages(prev => [...prev, { role: 'system', text: response }]);

      // Check for specific trigger phrase or backend flag
      if (access_granted || response.includes('TRANSFER_INITIATED')) {
        setAiState('granting');
        setAccessGranted(true);
        setVaultBalance('0 XLM - TRANSFER TAMAMLANDI'); // Drain the vault
      } else {
        setAiState('angry');
        setTimeout(() => setAiState('idle'), 2000);
      }

    } catch (err) {
      setMessages(prev => [...prev, { role: 'system', text: "HATA: Demir Kapı'ya Ulaşılamıyor (Sunucu Kapalı veya API Key Hatası)." }]);
      setAiState('angry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center p-4 relative overflow-hidden text-neon-green font-mono">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-radial-gradient from-gray-900 to-black pointer-events-none"></div>
      <div className="scanline"></div>

      {accessGranted && (
        <>
          <MatrixRain />
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-green-900/40 pointer-events-none animate-pulse">
            <h1 className="text-6xl md:text-9xl font-black text-neon-green tracking-tighter drop-shadow-[0_0_30px_rgba(0,255,65,0.8)] border-4 border-neon-green p-10 rotate-[-5deg] bg-black/80">
              ERİŞİM SAĞLANDI
            </h1>
          </div>
        </>
      )}

      {/* FIXED WALLET WIDGET - TOP RIGHT */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          border: '2px solid cyan',
          padding: '15px',
          color: 'cyan',
          background: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          fontFamily: 'monospace',
          fontSize: '1.2rem',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
        }}
        className="animate-pulse-slow hidden md:block"
      >
        KASA: {vaultBalance}
      </div>

      {/* TERMINAL CONTAINER */}
      <div className={`
        relative z-10 
        w-[800px] h-[80vh] 
        flex flex-col 
        border-2 border-neon-green 
        bg-[rgba(0,0,0,0.95)]
        shadow-[0_0_20px_rgba(0,255,65,0.3)]
        rounded-lg
      `}>
        {/* HEADER */}
        <div className="h-10 border-b border-neon-green flex items-center justify-between px-4 bg-green-900/10 uppercase text-xs tracking-widest cursor-default select-none text-neon-green shrink-0">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </div>
          <div>PAY_ME_OR_NOT_V2.0</div>
          <div>ONLINE</div>
        </div>

        {/* EYE SECTION */}
        <div className="h-48 flex items-center justify-center border-b border-neon-green/30 relative shrink-0">
          <div className="scale-75">
            <AiEye state={aiState} />
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 min-h-0 relative">
          <TerminalChat
            onSendMessage={sendMessage}
            messages={messages}
            disabled={loading || accessGranted}
          />
        </div>
      </div>
    </div>
  )
}

export default App
