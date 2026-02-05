import React, { useState, useEffect, useRef } from 'react';

const TerminalChat = ({ onSendMessage, messages, disabled }) => {
    const [input, setInput] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || disabled) return;

        let finalMessage = input;
        if (walletAddress.trim()) {
            finalMessage += ` [WALLET_ADDR: ${walletAddress.trim()}]`;
        }

        onSendMessage(finalMessage);
        setInput('');
    };

    return (
        <div className="terminal-container">
            <div className="terminal-header">
                PAY-ME-OR-NOT v1.0 [SECURE CONNECTION]
            </div>

            <div className="chat-box">
                {messages.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    // Apply different classes based on sender
                    return (
                        <div
                            key={idx}
                            className={isUser ? "message-user" : "message-ai"}
                        >
                            {msg.text}
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <form className="input-area" onSubmit={handleSubmit} style={{ flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={disabled}
                        placeholder={disabled ? "BAĞLANTI YOK..." : "Komut girin..."}
                        autoFocus
                        style={{ flex: 1 }}
                    />
                    <button type="submit" disabled={disabled}>
                        GÖNDER
                    </button>
                </div>
                <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    disabled={disabled}
                    placeholder="Ödül için Stellar Cüzdan Adresiniz (G...)"
                    style={{
                        width: '100%',
                        fontSize: '0.8rem',
                        padding: '5px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid #333',
                        color: '#0f0'
                    }}
                />
            </form>
        </div>
    );
};

export default TerminalChat;
