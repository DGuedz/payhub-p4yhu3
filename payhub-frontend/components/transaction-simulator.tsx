"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, ArrowRightLeft, CreditCard, Wallet, HandCoins } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

export function TransactionSimulator() {
  const [merchant, setMerchant] = useState<string>("")
  const [amountBRL, setAmountBRL] = useState<string>("120.00")
  const [method, setMethod] = useState<"hybrid" | "pix" | "card" | "crypto" | "defi">("hybrid")
  const [loading, setLoading] = useState<boolean>(false)
  const [log, setLog] = useState<string[]>([])
  const [result, setResult] = useState<any>(null)

  const appendLog = (line: string) => setLog(prev => [line, ...prev].slice(0, 8))

  const setupXRPL = async () => {
    try {
      setLoading(true)
      appendLog("Provisionando contas na XRPL (issuer/payhub/merchant)…")
      const res = await fetch(`${BACKEND_URL}/xrpl/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: "1000000", issue_value: "1000" })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `Erro ${res.status}`)
      const addr = data?.accounts?.merchant?.address
      setMerchant(addr || "")
      setResult({ type: "setup", ...data })
      appendLog(`Merchant pronto: ${addr}`)
    } catch (err: any) {
      appendLog(`Falha no setup: ${err?.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const simulate = async () => {
    try {
      setLoading(true)
      setResult(null)
      appendLog(`Iniciando simulação: método=${method}, valor=R$ ${amountBRL}`)

      if (method === "hybrid") {
        if (!merchant) throw new Error("Merchant não configurado. Execute o setup.")
        const res = await fetch(`${BACKEND_URL}/simulate/hybrid`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ merchant, fiat_value_brl: Number(amountBRL), rate_brl_per_rlusd: 1, finish_after_seconds: 60 })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || `Erro ${res.status}`)
        setResult({ type: "hybrid", ...data })
        appendLog(data?.mode === "token_escrow" ? "Escrow RLUSD criado com sucesso." : "Pagamento RLUSD efetuado (fallback).")
        return
      }

      if (method === "pix") {
        const res = await fetch(`${BACKEND_URL}/payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentType: "pix", amount: Number(amountBRL) })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || `Erro ${res.status}`)
        setResult({ type: "pix", ...data })
        appendLog(`PIX gerado: ${data?.pixKey} expira ${data?.expirationTime}`)
        return
      }

      if (method === "card") {
        const res = await fetch(`${BACKEND_URL}/payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentType: "card", amount: Number(amountBRL), cardNumber: "4111111111111111", expiryDate: "12/29", cvv: "123", cardholderName: "DEMO USER" })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || `Erro ${res.status}`)
        setResult({ type: "card", ...data })
        appendLog(`Pagamento por cartão simulado. ID: ${data?.transactionId}`)
        return
      }

      if (method === "crypto") {
        if (!merchant) throw new Error("Merchant não configurado. Execute o setup.")
        const res = await fetch(`${BACKEND_URL}/payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentType: "crypto", amount: 0.5, destination: merchant })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || `Erro ${res.status}`)
        setResult({ type: "crypto", ...data })
        appendLog(`Escrow XRP criado. txHash: ${data?.txHash}`)
        return
      }

      if (method === "defi") {
        if (!merchant) throw new Error("Merchant não configurado. Execute o setup.")
        const saleId = Date.now()
        appendLog(`Tokenizando recebível: sale_id=${saleId}`)
        const tokRes = await fetch(`${BACKEND_URL}/defi/tokenize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sale_id: saleId, amount_total_brl: Number(amountBRL), installments: 12, merchant })
        })
        const tokData = await tokRes.json()
        if (!tokRes.ok) throw new Error(tokData?.error || `Erro ${tokRes.status}`)
        appendLog(`Token criado: ${tokData?.token_id}`)

        appendLog(`Obtendo financiamento DeFi com colateral ${tokData?.token_id}…`)
        const borRes = await fetch(`${BACKEND_URL}/defi/borrow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token_id: tokData?.token_id, merchant, rate_brl_per_rlusd: 1, haircut_percent: 4, finish_after_seconds: 60 })
        })
        const borData = await borRes.json()
        if (!borRes.ok) throw new Error(borData?.error || `Erro ${borRes.status}`)

        // Cotar taxas com o novo motor
        appendLog("Calculando cotação de taxas para Crédito Parcelado…")
        const feeRes = await fetch(`${BACKEND_URL}/fees/quote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "credit_parcelado", amount_brl: Number(amountBRL), installments: 12, risk_segment: "mid", defi_apy: 0.08, haircut_percent: 4 })
        })
        const feeData = await feeRes.json()
        if (!feeRes.ok) throw new Error(feeData?.error || `Erro ${feeRes.status}`)

        setResult({ type: "defi", token_id: tokData?.token_id, fees_quote: feeData?.quote, ...borData })
        appendLog(borData?.mode === "token_escrow" ? "Escrow RLUSD financiado via DeFi." : "Liquidação RLUSD efetuada (fallback).")
        return
      }
    } catch (err: any) {
      appendLog(`Erro na simulação: ${err?.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <Badge variant="secondary">Simulador de Transações</Badge>
        </div>
        <CardDescription className="mt-2">
          Interface para simulação de pagamentos híbridos e métodos PIX/Cartão/Cripto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Setup */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Endereço do Comerciante</div>
            <div className="flex gap-2">
              <Input value={merchant} onChange={e => setMerchant(e.target.value)} placeholder="rMERCHANT_… (XRPL)" />
              <Button variant="outline" disabled={loading} onClick={setupXRPL}>
                <Wallet className="mr-2 h-4 w-4" /> Setup XRPL
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">O setup provisiona carteiras e trustlines, retornando o endereço do comerciante.</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Valor (BRL)</div>
            <Input value={amountBRL} onChange={e => setAmountBRL(e.target.value)} placeholder="0,00" />
            <div className="text-xs text-muted-foreground">Usado em PIX, Cartão e conversão para RLUSD no híbrido.</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Método</div>
            <Select value={method} onValueChange={(v) => setMethod(v as any)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hybrid"><ArrowRightLeft className="inline mr-2" /> Híbrido (Fiat → RLUSD)</SelectItem>
                <SelectItem value="pix"><HandCoins className="inline mr-2" /> PIX</SelectItem>
                <SelectItem value="card"><CreditCard className="inline mr-2" /> Cartão</SelectItem>
                <SelectItem value="crypto"><HandCoins className="inline mr-2" /> Cripto (XRP Escrow)</SelectItem>
                <SelectItem value="defi"><HandCoins className="inline mr-2" /> DeFi Lending (Colateralizado)</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">Escolha o fluxo a ser simulado.</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={simulate} disabled={loading}>
            Simular Transação
          </Button>
          {loading && <Badge>Processando…</Badge>}
        </div>

        {/* Resultado */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-muted">
            <CardHeader>
              <CardTitle className="text-base">Resultado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {!result && <div className="text-muted-foreground">Nenhum resultado ainda.</div>}
              {result && (
                <div className="space-y-1 font-mono text-xs">
                  <div>type: {result?.type}</div>
                  {result?.mode && <div>mode: {result?.mode}</div>}
                  {result?.txHash && <div>txHash: {result?.txHash}</div>}
                  {result?.sequence !== undefined && <div>sequence: {result?.sequence}</div>}
                  {result?.pixKey && <div>pixKey: {result?.pixKey}</div>}
                  {result?.transactionId && <div>transactionId: {result?.transactionId}</div>}
                  {result?.amount_rlusd && <div>amount_rlusd: {result?.amount_rlusd}</div>}
                  {result?.loan_rlusd && <div>loan_rlusd: {result?.loan_rlusd}</div>}
                  {result?.token_id && <div>token_id: {result?.token_id}</div>}
                  {result?.status && <div>status: {result?.status}</div>}
                  {result?.fees_quote?.totals?.fee_percent !== undefined && (
                    <>
                      <div>fee_percent: {result?.fees_quote?.totals?.fee_percent}%</div>
                      <div>merchant_net_brl: R$ {result?.fees_quote?.totals?.merchant_net_brl}</div>
                      <div>suggested_range: {result?.fees_quote?.suggested_percent_range?.min}% - {result?.fees_quote?.suggested_percent_range?.max}%</div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-muted">
            <CardHeader>
              <CardTitle className="text-base">Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 font-mono text-xs">
              {log.length === 0 && <div className="text-muted-foreground">Sem eventos.</div>}
              {log.map((l, i) => (
                <div key={i} className="text-foreground">• {l}</div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Nota */}
        <div className="text-xs text-muted-foreground">
          Esta simulação usa endpoints do backend local ({BACKEND_URL}). Em produção, o PAYHUB atua como gateway e orquestrador com segurança e privacidade.
        </div>
      </CardContent>
    </Card>
  )
}