const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:4000'

export type EscrowInfo = { mode?: string; sequence?: number; txHash?: string; amount?: string }

async function postJSON<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  })
  const data = await res.json()
  if (!res.ok) throw new Error((data as any)?.error || `Erro ${res.status}`)
  return data as T
}

export async function setupXRPL(opts: { limit?: string; issue_value?: string } = {}): Promise<{ merchantAddress?: string }>
{
  const { limit = '1000000', issue_value = '1000' } = opts
  const data = await postJSON<any>('/xrpl/setup', { limit, issue_value })
  const merchantAddress: string | undefined = data?.accounts?.merchant?.address
  return { merchantAddress }
}

export async function simulateHybrid(params: {
  merchant: string
  fiat_value_brl: number
  rate_brl_per_rlusd?: number
  finish_after_seconds?: number
}): Promise<{ mode?: string; sequence?: number; txHash?: string; amount_rlusd?: string }>
{
  const { merchant, fiat_value_brl, rate_brl_per_rlusd = 1, finish_after_seconds = 60 } = params
  return postJSON('/simulate/hybrid', { merchant, fiat_value_brl, rate_brl_per_rlusd, finish_after_seconds })
}

export async function escrowFinish(params: { offerSequence: number }): Promise<{ ok: boolean }>
{
  const { offerSequence } = params
  const data = await postJSON<any>('/escrow/rlusd/finish', { offerSequence })
  return { ok: !!data }
}

export async function quoteFees(params: {
  type: 'pix' | 'debit_credit_vista' | 'credit_parcelado'
  amount_brl: number
  installments?: number
  risk_segment?: 'low' | 'mid' | 'high'
  defi_apy?: number
  haircut_percent?: number
}): Promise<{ status: string; amount_brl: number; quote: any }>
{
  const { type, amount_brl, installments = 12, risk_segment = 'mid', defi_apy = 0.08, haircut_percent = 4 } = params
  return postJSON('/fees/quote', { type, amount_brl, installments, risk_segment, defi_apy, haircut_percent })
}

export async function tokenizeReceivable(params: { sale_id: string | number; amount_total_brl: number; installments?: number; merchant?: string }): Promise<any>
{
  const { sale_id, amount_total_brl, installments = 12, merchant } = params
  return postJSON('/defi/tokenize', { sale_id, amount_total_brl, installments, merchant })
}

export async function defiBorrow(params: { token_id: string; merchant?: string; rate_brl_per_rlusd?: number; haircut_percent?: number; finish_after_seconds?: number }): Promise<any>
{
  const { token_id, merchant, rate_brl_per_rlusd = 1, haircut_percent = 4, finish_after_seconds = 60 } = params
  return postJSON('/defi/borrow', { token_id, merchant, rate_brl_per_rlusd, haircut_percent, finish_after_seconds })
}

export const API = { BACKEND_URL, setupXRPL, simulateHybrid, escrowFinish, quoteFees, tokenizeReceivable, defiBorrow }