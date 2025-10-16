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
    console.error('Erro /xrpl/setup:', err);
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
    console.error('Erro /escrow/create:', err);
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
    console.error('Erro /escrow/finish:', err);
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
    console.error('Erro /escrow/rlusd/create:', err);
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
    console.error('Erro /escrow/rlusd/finish:', err);
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

app.listen(port, () => {
  console.log(`PAYHUB API rodando em http://localhost:${port}`);
});
