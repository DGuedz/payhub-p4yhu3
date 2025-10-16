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
async function getClient() {
  if (xrplClient && xrplClient.isConnected()) return xrplClient;
  const url = process.env.XRPL_SERVER_URL || 'wss://s.altnet.rippletest.net:51233';
  xrplClient = new xrpl.Client(url);
  await xrplClient.connect();
  return xrplClient;
}

function getOperatorWallet() {
  const seed = process.env.PAYHUB_OPERATOR_SEED;
  if (!seed) {
    throw new Error('Defina PAYHUB_OPERATOR_SEED no .env para assinar transações.');
  }
  return xrpl.Wallet.fromSeed(seed);
}

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
    const finishAfter = Math.floor(Date.now() / 1000) + Number(finish_after_seconds);

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

app.listen(port, () => {
  console.log(`PAYHUB API rodando em http://localhost:${port}`);
});
