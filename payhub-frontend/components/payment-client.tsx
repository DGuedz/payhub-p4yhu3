"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useBalance } from "wagmi";
import { parseEther, formatEther } from "viem";
import { useState } from "react";

const SendTransactionTest = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { sendTransaction, data: hash, isPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("crypto");

  const handleTabClick = async (tab: string) => {
    setActiveTab(tab);
    try {
      await fetch("http://localhost:3000/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentType: tab,
          amount: amount,
          destination: recipient,
        }),
      });
    } catch (error) {
      // Error handling for payment type sending
    }
  };

  const handleSendTransaction = () => {
    if (!isConnected) {
      alert("Por favor, conecte sua carteira primeiro.");
      return;
    }

    if (!recipient || !amount) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (error) {
      alert("Erro ao enviar transação. Verifique os dados e tente novamente.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "crypto":
        return (
          <div className="transaction-container">
            <div className="wallet-dashboard">
              <div className="balance-card">
                <div className="balance-header">
                  <span className="balance-label">Saldo Disponível</span>
                </div>
                <div className="balance-amount">
                  {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : "0.0000 ETH"}
                </div>
                <div className="wallet-address">
                  <span className="address-label">Endereço:</span>
                  <code className="address-value">{address?.slice(0, 6)}...{address?.slice(-4)}</code>
                </div>
              </div>
            </div>
            
            <div className="transaction-form">
              <div className="form-header">
                <h3>Enviar Cripto</h3>
                <p>Demonstre a capacidade de pagamento blockchain</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="recipient">Endereço de Destino</label>
                <input
                  id="recipient"
                  type="text"
                  placeholder="0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Valor (ETH)</label>
                <input
                  id="amount"
                  type="text"
                  placeholder="0.001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-input"
                />
              </div>

              <button 
                onClick={handleSendTransaction}
                disabled={isPending || isConfirming}
                className="send-button"
              >
                {isPending ? "Enviando..." : "Enviar Transação"}
              </button>

              {hash && <div className="transaction-hash">Hash da Transação: {hash}</div>}
              {isConfirming && <div className="transaction-status">Aguardando confirmação...</div>}
              {isConfirmed && <div className="transaction-status">Transação confirmada!</div>}
            </div>
          </div>
        );
      case "pix":
        return (
          <div className="transaction-form">
            <div className="form-header">
              <h3>Pagar com PIX</h3>
              <p>Em breve: integração com o sistema de pagamentos instantâneos do Brasil.</p>
            </div>
          </div>
        );
      case "card":
        return (
          <div className="transaction-form">
            <div className="form-header">
              <h3>Pagar com Cartão</h3>
              <p>Em breve: aceite pagamentos com as principais bandeiras de cartão de crédito.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="transaction-section">
      <div className="section-header">
        <h2>Orquestrador de Pagamentos PAYHUB</h2>
        <p className="section-subtitle">Selecione o método de pagamento desejado</p>
      </div>
      
      <div className="tabs">
        <button onClick={() => handleTabClick("crypto")} className={activeTab === 'crypto' ? "active" : ""}>Cripto</button>
        <button onClick={() => handleTabClick("pix")} className={activeTab === 'pix' ? "active" : ""}>PIX</button>
        <button onClick={() => handleTabClick("card")} className={activeTab === 'card' ? "active" : ""}>Cartão</button>
      </div>

      {isConnected ? (
        renderContent()
      ) : (
        <div className="connect-wallet-prompt">
          <h3>Conecte sua carteira para começar</h3>
          <p>Use o botão abaixo para se conectar ao PAYHUB.</p>
          <ConnectButton />
        </div>
      )}
    </div>
  );
};

export default SendTransactionTest;