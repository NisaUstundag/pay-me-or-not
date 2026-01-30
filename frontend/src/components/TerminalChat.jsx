import React, { useState, useEffect, useRef } from 'react';

const TerminalChat = ({ onSendMessage, messages, disabled }) => {
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || disabled) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-full bg-black/50 border border-neon-green/30 p-4 font-mono text-sm relative overflow-hidden rounded-md backdrop-blur-sm">
            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 z-10 p-2">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <span className={`text-[10px] uppercase mb-1 opacity-50 ${msg.role === 'user' ? 'text-cyan-500' : 'text-neon-green'}`}>
                            {msg.role === 'user' ? '> USER_INPUT' : '> SYSTEM_RESPONSE'}
                        </span>
                        <div className={`max-w-[80%] p-2 border ${msg.role === 'user'
                                ? 'border-cyan-500/50 text-cyan-400 bg-cyan-900/10'
                                : 'border-neon-green/50 text-neon-green bg-green-900/10'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 z-10 border-t border-neon-green/30 pt-4">
                <span className="text-neon-green animate-pulse">{'>'}</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={disabled}
                    className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 placeholder-gray-600"
                    placeholder={disabled ? "CONNECTION TERMINATED" : "Enter command..."}
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={disabled}
                    className="px-4 py-1 border border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-colors uppercase text-xs"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default TerminalChat;
