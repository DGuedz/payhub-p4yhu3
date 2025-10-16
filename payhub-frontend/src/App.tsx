import "./App.css";
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
      console.error("Erro ao enviar transação:", error);
      alert("Erro ao enviar transação. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="transaction-section">
      <div className="section-header">
        <h2>Demonstração Web3</h2>
        <p className="section-subtitle">Teste a integração blockchain do PAYHUB</p>
      </div>
      
      {isConnected ? (
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
              <h3>Enviar Transação de Teste</h3>
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
              {isPending ? "Preparando Transação..." : isConfirming ? "Confirmando na Blockchain..." : "Executar Pagamento"}
            </button>

            {hash && (
              <div className="transaction-status">
                <div className="status-header">
                  <span className="status-label">Status da Transação</span>
                </div>
                <div className="transaction-hash">
                  <span>Hash: </span>
                  <code>{hash.slice(0, 10)}...{hash.slice(-8)}</code>
                </div>
                {isConfirming && <div className="status-pending">Aguardando confirmação na rede...</div>}
                {isConfirmed && <div className="status-success">Transação confirmada com sucesso!</div>}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="connect-prompt">
          <div className="connect-card">
            <h3>Conecte sua Carteira</h3>
            <p>Para demonstrar a integração Web3 do PAYHUB, conecte uma carteira compatível</p>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="brand-section">
              <h1 className="main-title">P4YHU3</h1>
              <div className="brand-subtitle">PAYHUB</div>
            </div>
            <p className="value-proposition">
              Transforme pagamentos tradicionais em liquidez instantânea através da blockchain
            </p>
            <div className="connect-section">
              <ConnectButton />
            </div>
          </div>
        </header>

        <main className="main-content">
          <SendTransactionTest />
          
          <section className="features-section">
            <div className="section-header">
              <h2>Nossa Solução</h2>
              <p className="section-subtitle">Tecnologia XRPL para pagamentos híbridos seguros</p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <div className="icon-escrow"></div>
                </div>
                <h3>Escrow Inteligente</h3>
                <p>Fundos bloqueados automaticamente na XRPL garantem segurança total para todas as partes</p>
                <div className="feature-tech">XRPL Escrow</div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <div className="icon-liquidity"></div>
                </div>
                <h3>Liquidez Instantânea</h3>
                <p>Comerciantes recebem pagamento à vista em stablecoins enquanto clientes pagam parcelado</p>
                <div className="feature-tech">RLUSD Settlement</div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <div className="icon-hybrid"></div>
                </div>
                <h3>Pagamento Híbrido</h3>
                <p>Integração perfeita entre PIX, cartões tradicionais e blockchain para máxima flexibilidade</p>
                <div className="feature-tech">Multi-Chain</div>
              </div>
            </div>
          </section>

          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">100%</div>
                <div className="stat-label">Segurança Garantida</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">Instant</div>
                <div className="stat-label">Liquidação</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Disponibilidade</div>
              </div>
            </div>
          </section>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-brand">
              <span>P4YHU3 - PAYHUB</span>
            </div>
            <div className="footer-info">
              <span>Vega House Hackathon 2024</span>
              <span className="separator">•</span>
              <span>Trilha XRPL</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
