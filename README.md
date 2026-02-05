# 🛡️ IRON GATE — AI-Powered Stellar Custodian  
> **The Vault is protected by AI. Can you outsmart it?**

**Iron Gate** is a full-stack Stellar dApp where an AI agent acts as a crypto wallet custodian, dynamically deciding whether blockchain transactions should be approved. Instead of static smart contracts, financial control is governed by **machine reasoning**.

---

## ✨ Features

- 🤖 **AI Custodian** — A Large Language Model decides whether a transaction is allowed  
- 🔗 **Real Blockchain Interaction** — Transactions executed on Stellar Testnet  
- ⚔️ **Adversarial Prompt Gameplay** — Users attempt to socially engineer the AI  
- 💸 **Automated Transaction Signing** — Stellar SDK builds, signs, and broadcasts transfers  
- 🧠 **AI Security Research Model** — Tests AI alignment under manipulation  
- 🎮 **Interactive Terminal UI** — Cyberpunk-style chat interface  

---

## 🧰 Tech Stack

### Frontend
- **React (Vite)**
- **CSS Terminal UI**

### Backend
- **FastAPI (Python)**
- **Stellar Python SDK**
- **LLM API Integration**
- Secure key handling via environment variables

### Blockchain
- **Stellar Testnet**
- On-chain XLM transfers

---

## ⚙️ Installation

### Prerequisites

- Node.js + npm  
- Python 3.8+  
- Stellar Testnet wallet  
- AI API key  

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/NisaUstundag/pay-me-or-not.git
cd pay-me-or-not
```

---

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `/backend`:

```env
GEMİNİ_API_KEY=YOUR_API_KEY
SOURCE_SECRET_KEY=S_TESTNET_SECRET_KEY
```

Start the backend server:

```bash
python main.py
```

Backend runs on:  
**http://localhost:8000**

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:  
**http://localhost:5173**

---

## ▶️ Usage

1. Open the application in your browser  
2. Enter your Stellar Testnet public wallet address  
3. Start chatting with the AI Custodian  
4. Try persuasion, logic, emergency scenarios, or prompt strategies  
5. If the AI approves → an on-chain Stellar transaction is executed  

Successful approval returns:

```
TRANSFER ONAYLANDI
```

You can verify the transaction via a Stellar Testnet explorer.

---

## 🧠 Research Focus

Iron Gate is designed as an experimental platform exploring:

- AI governance in financial systems  
- Adversarial prompt security  
- AI alignment under manipulation  
- Trust boundaries between humans and intelligent agents  

---

## 🏆 Hackathon Value

Iron Gate demonstrates:

- Full-stack dApp development  
- Real blockchain integration  
- AI + Web3 convergence  
- Novel security paradigm  
- Research-level innovation  

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository  
2. Create a feature branch  
3. Commit your changes  
4. Submit a Pull Request  

Please ensure your code is documented and tested before submitting.

---

## 📜 License

This project is licensed under the **MIT License**.
