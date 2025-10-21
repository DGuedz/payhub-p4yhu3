const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const xrpl = require('xrpl');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'PAYHUB', version: 'mvp' });
});

app.post('/payment', async (req, res) => {
  const { paymentType, amount, destination } = req.body;

  // Placeholder for payment orchestration logic
  switch (paymentType) {
    case 'crypto':
      try {
        const client = await getClient();
        const wallet = getOperatorWallet();
        const amountDrops = Math.floor(Number(amount) * 1_000_000).toString();
        const finishAfter = rippleNowSeconds() + 60; // 60s para o escrow expirar

        const tx = {
          TransactionType: 'EscrowCreate',
          Account: wallet.address,
          Destination: destination,
          Amount: amountDrops,
          FinishAfter: finishAfter,
        };

        const prepared = await client.autofill(tx);
        const signed = wallet.sign(prepared);
        const result = await client.submitAndWait(signed.tx_blob);

        return res.json({
          status: 'submitted',
          paymentType: 'crypto',
          txHash: signed.hash,
          sequence: prepared.Sequence,
          result: result.result,
        });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to process crypto payment.' });
      }
      break;
    case 'pix':
      try {
        // Simulação de geração de código PIX
        const pixKey = generatePixKey();
        const expirationTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
        
        return res.json({
          status: 'pending',
          paymentType: 'pix',
          pixKey: pixKey,
          expirationTime: expirationTime.toISOString(),
          message: 'PIX payment initiated. Use the provided PIX key to complete the payment.',
          instructions: 'Copy the PIX key and paste in your banking app to complete the payment.'
        });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to process PIX payment.' });
      }
      break;
    case 'card':
      try {
        // Simulação de processamento de cartão
        const { cardNumber, expiryDate, cvv, cardholderName } = req.body;
        
        if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
          return res.status(400).json({ error: 'Card details are required for card payments.' });
        }
        
        // Validação básica do cartão
        if (!isValidCardNumber(cardNumber)) {
          return res.status(400).json({ error: 'Invalid card number.' });
        }
        
        if (!isValidExpiryDate(expiryDate)) {
          return res.status(400).json({ error: 'Invalid expiry date.' });
        }
        
        // Simulação de processamento bem-sucedido
        const transactionId = generateTransactionId();
        
        return res.json({
          status: 'completed',
          paymentType: 'card',
          transactionId: transactionId,
          amount: amount,
          message: 'Card payment processed successfully.',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to process card payment.' });
      }
      break;
    default:
      return res.status(400).json({ error: 'Invalid payment type' });
  }

  res.json({
    status: 'received',
    paymentType,
    message: `Payment request for ${paymentType} received and is being processed.`,
  });
});

// XRPL helpers
let xrplClient;
let operatorOverrideWallet; // definido pelo /xrpl/setup quando seeds efêmeras são geradas
async function getClient() {
  if (xrplClient && xrplClient.isConnected()) return xrplClient;
  const url = process.env.XRPL_SERVER_URL || 'wss://s.altnet.rippletest.net:51233';
  xrplClient = new xrpl.Client(url);
  await xrplClient.connect();
  return xrplClient;
}

function getOperatorWallet() {
  const seed = process.env.PAYHUB_OPERATOR_SEED || process.env.PAYHUB_SEED;
  if (seed) return xrpl.Wallet.fromSeed(seed);
  if (operatorOverrideWallet) return operatorOverrideWallet;
  throw new Error('Defina PAYHUB_OPERATOR_SEED ou PAYHUB_SEED no .env (ou chame /xrpl/setup para gerar carteira).');
}

// Converte tempo atual para Ripple Epoch (segundos desde 2000-01-01)
function rippleNowSeconds() {
  const UNIX_EPOCH_TO_RIPPLE_EPOCH = 946684800; // 1970->2000
  return Math.floor(Date.now() / 1000) - UNIX_EPOCH_TO_RIPPLE_EPOCH;
}

// Converte código de moeda: 3 letras (ex.: USD) ou hex-160 (ex.: RLUSD)
function toCurrencyCode(code) {
  const c = (code || '').toUpperCase();
  if (c.length === 3) return c;
  const bytes = Buffer.from(c, 'ascii');
  if (bytes.length > 20) throw new Error('Currency code muito longo (>20 bytes).');
  const hex = bytes.toString('hex').padEnd(40, '0');
  return hex.toUpperCase();
}

// Descobre se TokenEscrow está habilitado no nó
async function isTokenEscrowEnabled(client) {
  try {
    const info = await client.request({ command: 'server_info' });
    const enabled = info?.result?.info?.validated_ledger?.amendments || info?.result?.info?.amendments || [];
    return enabled.includes('TokenEscrow');
  } catch (_) {
    return false;
  }
}

// Setup de contas e trustlines para RLUSD na Testnet
app.post('/xrpl/setup', async (req, res) => {
  try {
    const client = await getClient();
    const currency = toCurrencyCode(process.env.IOU_CURRENCY || 'RLUSD');
    const limitValue = String(req.body?.limit || '1000000'); // limite alto para testes
    const issueValue = String(req.body?.issue_value || '1000');

    const issuerSeed = process.env.ISSUER_SEED;
    const payhubSeed = process.env.PAYHUB_SEED || process.env.PAYHUB_OPERATOR_SEED;
    const merchantSeed = process.env.MERCHANT_SEED;

    const issuer = issuerSeed ? xrpl.Wallet.fromSeed(issuerSeed) : xrpl.Wallet.generate();
    const payhub = payhubSeed ? xrpl.Wallet.fromSeed(payhubSeed) : xrpl.Wallet.generate();
    const merchant = merchantSeed ? xrpl.Wallet.fromSeed(merchantSeed) : xrpl.Wallet.generate();

    // Fund accounts via faucet when possible (Testnet)
    await client.fundWallet(issuer).catch(() => {});
    await client.fundWallet(payhub).catch(() => {});
    await client.fundWallet(merchant).catch(() => {});

    // Define operador efêmero para uso em endpoints de escrow RLUSD
    operatorOverrideWallet = payhub;

    // Trustline PAYHUB -> ISSUER
    const trustPayhub = {
      TransactionType: 'TrustSet',
      Account: payhub.address,
      LimitAmount: { currency, issuer: issuer.address, value: limitValue },
    };
    const preparedTrustPayhub = await client.autofill(trustPayhub);
    const signedTrustPayhub = payhub.sign(preparedTrustPayhub);
    const resultTrustPayhub = await client.submitAndWait(signedTrustPayhub.tx_blob);

    // Trustline MERCHANT -> ISSUER
    const trustMerchant = {
      TransactionType: 'TrustSet',
      Account: merchant.address,
      LimitAmount: { currency, issuer: issuer.address, value: limitValue },
    };
    const preparedTrustMerchant = await client.autofill(trustMerchant);
    const signedTrustMerchant = merchant.sign(preparedTrustMerchant);
    const resultTrustMerchant = await client.submitAndWait(signedTrustMerchant.tx_blob);

    // Emissão de RLUSD do ISSUER para PAYHUB
    const issuePayment = {
      TransactionType: 'Payment',
      Account: issuer.address,
      Destination: payhub.address,
      Amount: { currency, issuer: issuer.address, value: issueValue },
    };
    const preparedIssue = await client.autofill(issuePayment);
    const signedIssue = issuer.sign(preparedIssue);
    const resultIssue = await client.submitAndWait(signedIssue.tx_blob);

    return res.json({
      status: 'ok',
      currency,
      accounts: {
        issuer: { address: issuer.address, seed: issuerSeed || issuer.seed },
        payhub: { address: payhub.address, seed: payhubSeed || payhub.seed },
        merchant: { address: merchant.address, seed: merchantSeed || merchant.seed },
      },
      trustlines: {
        payhub: resultTrustPayhub.result,
        merchant: resultTrustMerchant.result,
      },
      issuance: { txHash: signedIssue.hash, result: resultIssue.result },
    });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
});

// Criação de Escrow (XRP por padrão)
app.post('/escrow/create', async (req, res) => {
  try {
    const { destination, amount_xrp, finish_after_seconds = 60 } = req.body || {};
    if (!destination || !amount_xrp) {
      return res.status(400).json({ error: 'Campos obrigatórios: destination, amount_xrp' });
    }

    const client = await getClient();
    const wallet = getOperatorWallet();

    const amountDrops = Math.floor(Number(amount_xrp) * 1_000_000).toString();
    const finishAfter = rippleNowSeconds() + Number(finish_after_seconds);

    const tx = {
      TransactionType: 'EscrowCreate',
      Account: wallet.address,
      Destination: destination,
      Amount: amountDrops,
      FinishAfter: finishAfter,
    };

    const prepared = await client.autofill(tx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return res.json({
      status: 'submitted',
      txHash: signed.hash,
      sequence: prepared.Sequence,
      owner: wallet.address,
      result: result.result,
    });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
});

// Finalização de Escrow
app.post('/escrow/finish', async (req, res) => {
  try {
    const { offerSequence, owner } = req.body || {};
    if (offerSequence === undefined) {
      return res.status(400).json({ error: 'Campo obrigatório: offerSequence' });
    }

    const client = await getClient();
    const wallet = getOperatorWallet();

    const tx = {
      TransactionType: 'EscrowFinish',
      Account: wallet.address, // quem assina: owner ou destination podem finalizar
      Owner: owner || wallet.address,
      OfferSequence: Number(offerSequence),
    };

    const prepared = await client.autofill(tx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return res.json({ status: 'submitted', txHash: signed.hash, result: result.result });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
});

// Escrow de RLUSD (TokenEscrow) — cai para Payment caso não suportado
app.post('/escrow/rlusd/create', async (req, res) => {
  try {
    const client = await getClient();
    const currency = toCurrencyCode(process.env.IOU_CURRENCY || 'RLUSD');
    const { destination, amount_value, finish_after_seconds = 60, cancel_after_seconds = 600 } = req.body || {};
    if (!destination || !amount_value) {
      return res.status(400).json({ error: 'Campos obrigatórios: destination, amount_value' });
    }

    const wallet = getOperatorWallet(); // funding via PAYHUB
    const enabled = await isTokenEscrowEnabled(client);
    const rippleNow = rippleNowSeconds();

    if (enabled) {
      const tx = {
        TransactionType: 'EscrowCreate',
        Account: wallet.address,
        Destination: destination,
        Amount: { currency, issuer: wallet.address, value: String(amount_value) },
        FinishAfter: rippleNow + Number(finish_after_seconds),
        CancelAfter: rippleNow + Number(cancel_after_seconds),
      };
      const prepared = await client.autofill(tx);
      const signed = wallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);
      return res.json({ status: 'submitted', mode: 'token_escrow', txHash: signed.hash, sequence: prepared.Sequence, result: result.result });
    }

    // Fallback: Payment direto (sem escrow) para demonstrar liquidação RLUSD
    const paymentTx = {
      TransactionType: 'Payment',
      Account: wallet.address,
      Destination: destination,
      Amount: { currency, issuer: wallet.address, value: String(amount_value) },
    };
    const preparedPay = await client.autofill(paymentTx);
    const signedPay = wallet.sign(preparedPay);
    const resultPay = await client.submitAndWait(signedPay.tx_blob);
    return res.json({ status: 'submitted', mode: 'payment_fallback', txHash: signedPay.hash, result: resultPay.result });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
});

app.post('/escrow/rlusd/finish', async (req, res) => {
  try {
    const client = await getClient();
    const { offerSequence, owner } = req.body || {};
    if (offerSequence === undefined) {
      return res.status(400).json({ error: 'Campo obrigatório: offerSequence' });
    }
    const wallet = getOperatorWallet();
    const tx = {
      TransactionType: 'EscrowFinish',
      Account: wallet.address,
      Owner: owner || wallet.address,
      OfferSequence: Number(offerSequence),
    };
    const prepared = await client.autofill(tx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    return res.json({ status: 'submitted', txHash: signed.hash, result: result.result });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
});

// Simulação do Fluxo Híbrido: PIX R$ off-chain -> Escrow RLUSD on-chain
app.post('/simulate/hybrid', async (req, res) => {
  try {
    const client = await getClient();
    const currency = toCurrencyCode(process.env.IOU_CURRENCY || 'RLUSD');
    const { merchant, fiat_value_brl, rate_brl_per_rlusd = 1, finish_after_seconds = 60 } = req.body || {};
    if (!merchant || !fiat_value_brl) {
      return res.status(400).json({ error: 'Campos obrigatórios: merchant, fiat_value_brl' });
    }
    const amountValue = (Number(fiat_value_brl) / Number(rate_brl_per_rlusd)).toFixed(2);
    const wallet = getOperatorWallet();
    const enabled = await isTokenEscrowEnabled(client);
    const rippleNow = rippleNowSeconds();

    if (enabled) {
      const tx = {
        TransactionType: 'EscrowCreate',
        Account: wallet.address,
        Destination: merchant,
        Amount: { currency, issuer: wallet.address, value: String(amountValue) },
        FinishAfter: rippleNow + Number(finish_after_seconds),
        CancelAfter: rippleNow + Number(finish_after_seconds) + 600,
      };
      const prepared = await client.autofill(tx);
      const signed = wallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);
      return res.json({
        status: 'submitted',
        flow: 'hybrid',
        mode: 'token_escrow',
        currency,
        fiat_value_brl,
        amount_rlusd: amountValue,
        txHash: signed.hash,
        sequence: prepared.Sequence,
        result: result.result,
      });
    }

    const paymentTx = {
      TransactionType: 'Payment',
      Account: wallet.address,
      Destination: merchant,
      Amount: { currency, issuer: wallet.address, value: String(amountValue) },
    };
    const preparedPay = await client.autofill(paymentTx);
    const signedPay = wallet.sign(preparedPay);
    const resultPay = await client.submitAndWait(signedPay.tx_blob);
    return res.json({
      status: 'submitted',
      flow: 'hybrid',
      mode: 'payment_fallback',
      currency,
      fiat_value_brl,
      amount_rlusd: amountValue,
      txHash: signedPay.hash,
      result: resultPay.result,
    });
  } catch (err) {
    console.error('Erro /simulate/hybrid:', err);
    return res.status(500).json({ error: String(err.message || err) });
  }
});

// Funções auxiliares para integração com PIX
function generatePixKey() {
  // Gera uma chave PIX aleatória no formato UUID
  return 'pix-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Funções auxiliares para integração com cartão
function isValidCardNumber(cardNumber) {
  // Implementação básica do algoritmo de Luhn para validação de cartão
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}

function isValidExpiryDate(expiryDate) {
  // Valida formato MM/YY ou MM/YYYY
  const match = expiryDate.match(/^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/);
  if (!match) return false;
  
  const month = parseInt(match[1]);
  let year = parseInt(match[2]);
  
  // Converte ano de 2 dígitos para 4 dígitos
  if (year < 100) {
    year += 2000;
  }
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  // Verifica se a data não expirou
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  
  return true;
}

function generateTransactionId() {
  // Gera um ID de transação único
  return 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

// --- DeFi Lending (mock) endpoints ---
const receivableTokens = new Map();

// Tokenização de recebível: cria RCV-ID e registra metadados (mock)
app.post('/defi/tokenize', async (req, res) => {
  try {
    const { sale_id, amount_total_brl, installments = 12, merchant } = req.body || {};
    if (!sale_id || !amount_total_brl) {
      return res.status(400).json({ error: 'Campos obrigatórios: sale_id, amount_total_brl' });
    }
    const tokenId = `RCV-${String(sale_id)}`;
    const record = {
      token_id: tokenId,
      sale_id,
      amount_total_brl: Number(amount_total_brl),
      installments: Number(installments),
      merchant,
      created_at: Date.now(),
      status: 'tokenized',
    };
    receivableTokens.set(tokenId, record);
    return res.json({ status: 'tokenized', ...record });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
});

// Empréstimo DeFi: usa o token como colateral e libera RLUSD via Escrow (mock)
app.post('/defi/borrow', async (req, res) => {
  try {
    const client = await getClient();
    const currency = toCurrencyCode(process.env.IOU_CURRENCY || 'RLUSD');
    const { token_id, merchant: merchantOverride, rate_brl_per_rlusd = 1, haircut_percent = 4, finish_after_seconds = 60 } = req.body || {};
    if (!token_id) {
      return res.status(400).json({ error: 'Campo obrigatório: token_id' });
    }

    const rec = receivableTokens.get(String(token_id));
    if (!rec) {
      return res.status(404).json({ error: 'Token não encontrado' });
    }

    const merchant = merchantOverride || rec.merchant;
    if (!merchant) {
      return res.status(400).json({ error: 'Merchant ausente: informe no token ou na requisição' });
    }

    const grossRlusd = Number(rec.amount_total_brl) / Number(rate_brl_per_rlusd);
    const loanRlusd = Number((grossRlusd * (1 - Number(haircut_percent) / 100)).toFixed(2));

    const wallet = getOperatorWallet();
    const enabled = await isTokenEscrowEnabled(client);
    const rippleNow = rippleNowSeconds();

    if (enabled) {
      const tx = {
        TransactionType: 'EscrowCreate',
        Account: wallet.address,
        Destination: merchant,
        Amount: { currency, issuer: wallet.address, value: String(loanRlusd) },
        FinishAfter: rippleNow + Number(finish_after_seconds),
        CancelAfter: rippleNow + Number(finish_after_seconds) + 600,
      };
      const prepared = await client.autofill(tx);
      const signed = wallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);

      // Atualiza estado do token (mock)
      receivableTokens.set(String(token_id), { ...rec, status: 'collateralized', loan_rlusd: loanRlusd, escrow_sequence: prepared.Sequence });

      return res.json({
        status: 'borrowed',
        flow: 'defi',
        mode: 'token_escrow',
        token_id: String(token_id),
        loan_rlusd: loanRlusd,
        haircut_percent: Number(haircut_percent),
        txHash: signed.hash,
        sequence: prepared.Sequence,
        result: result.result,
      });
    }

    // Fallback Payment direto em RLUSD
    const paymentTx = {
      TransactionType: 'Payment',
      Account: wallet.address,
      Destination: merchant,
      Amount: { currency, issuer: wallet.address, value: String(loanRlusd) },
    };
    const preparedPay = await client.autofill(paymentTx);
    const signedPay = wallet.sign(preparedPay);
    const resultPay = await client.submitAndWait(signedPay.tx_blob);

    receivableTokens.set(String(token_id), { ...rec, status: 'collateralized', loan_rlusd: loanRlusd, payment_tx_hash: signedPay.hash });

    return res.json({
      status: 'borrowed',
      flow: 'defi',
      mode: 'payment_fallback',
      token_id: String(token_id),
      loan_rlusd: loanRlusd,
      haircut_percent: Number(haircut_percent),
      txHash: signedPay.hash,
      result: resultPay.result,
    });
  } catch (err) {
    console.error('Erro /defi/borrow:', err);
    return res.status(500).json({ error: String(err.message || err) });
  }
});

// --- Motor de Taxas / Cotação ---
function round2(n) { return Number(Number(n).toFixed(2)); }

app.post('/fees/quote', async (req, res) => {
  try {
    const { type, amount_brl, installments = 12, risk_segment = 'mid', defi_apy = 0.08, haircut_percent = 4 } = req.body || {};
    const amount = Number(amount_brl || 0);
    if (!type || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Campos obrigatórios: type, amount_brl>0' });
    }

    let quote;

    if (type === 'pix') {
      const cost_acquisition_pct = 0.3; // custo repassado
      const suggested_min_pct = 0.5;
      const suggested_max_pct = 0.9;
      const suggested_pct = suggested_min_pct; // flat agressivo para micropagamentos
      quote = {
        type,
        suggested_percent_range: { min: suggested_min_pct, max: suggested_max_pct },
        breakdown: {
          cost_acquisition_pct,
          service_escrow_pct: round2(suggested_pct - cost_acquisition_pct),
        },
        totals: {
          fee_percent: suggested_pct,
          fee_amount_brl: round2(amount * (suggested_pct / 100)),
          merchant_net_brl: round2(amount * (1 - suggested_pct / 100)),
        },
      };
    }

    if (type === 'debit_credit_vista') {
      const cost_gateway_min = 1.0;
      const cost_gateway_max = 1.5;
      const suggested_min_pct = 1.8;
      const suggested_max_pct = 2.5;
      const suggested_pct = 2.0; // meio da faixa
      quote = {
        type,
        suggested_percent_range: { min: suggested_min_pct, max: suggested_max_pct },
        breakdown: {
          cost_gateway_pct: round2((cost_gateway_min + cost_gateway_max) / 2),
          arbitrage_margin_pct: round2(suggested_pct - ((cost_gateway_min + cost_gateway_max) / 2)),
        },
        totals: {
          fee_percent: suggested_pct,
          fee_amount_brl: round2(amount * (suggested_pct / 100)),
          merchant_net_brl: round2(amount * (1 - suggested_pct / 100)),
        },
      };
    }

    if (type === 'credit_parcelado') {
      // juros DeFi por perfil de risco (faixa típica)
      const riskMap = { low: 1.0, mid: 2.5, high: 3.5 };
      const defi_interest_pct = riskMap[String(risk_segment)] ?? riskMap.mid;
      const service_payhub_pct = 1.8; // dentro da faixa 1.5–2.0
      const total_fee_pct = round2(defi_interest_pct + service_payhub_pct);

      // faixa sugerida (2.5–5.0)
      const suggested_min_pct = 2.5;
      const suggested_max_pct = 5.0;

      // liquidez imediata estimada (em BRL) e RLUSD com haircut
      const merchant_net_brl = round2(amount * (1 - total_fee_pct / 100));
      const loan_rlusd_value = round2((amount * (1 - (haircut_percent / 100))));

      quote = {
        type,
        installments,
        risk_segment,
        suggested_percent_range: { min: suggested_min_pct, max: suggested_max_pct },
        breakdown: {
          defi_interest_pct,
          service_payhub_pct,
          haircut_percent,
        },
        totals: {
          fee_percent: total_fee_pct,
          fee_amount_brl: round2(amount * (total_fee_pct / 100)),
          merchant_net_brl,
          loan_rlusd_value,
        },
        yield_assumptions: {
          defi_apy,
        },
        message: 'Com DeFi Collateral, o comerciante recebe liquidez imediata e evita o desconto tradicional.',
      };
    }

    if (!quote) {
      return res.status(400).json({ error: 'type inválido. Use: pix | debit_credit_vista | credit_parcelado' });
    }

    return res.json({ status: 'ok', amount_brl: amount, quote });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
});

app.listen(port, () => {
  console.log(`PAYHUB API rodando em http://localhost:${port}`);
});
