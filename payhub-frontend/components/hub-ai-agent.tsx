"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Shield, TrendingUp, Brain, Sparkles } from "lucide-react"

interface YieldActivationResponse {
  activated: boolean
  merchantId: string
  segment: "micro" | "mid" | "enterprise"
  targetAPY: number
  allocationPolicy: {
    hotWalletPct: number
    yieldPct: number
    hotWalletAmount: number
    yieldAmount: number
  }
  metrics: {
    rlusdBalance: number
    estimatedMonthlyReturn: number
    estimatedDailyReturn: number
  }
  routes: {
    convertRLUSDToMXRP: { enabled: boolean; network: string; asset: string }
    staking: { strategy: string; provider: string }
  }
  message: string
  timestamp: number
}

export function HubAIAgent() {
  const [segment, setSegment] = useState<"micro" | "mid" | "enterprise">("micro")
  const [merchantId, setMerchantId] = useState<string>("merchant_demo")
  const [rlusdBalance, setRlusdBalance] = useState<number>(10000)
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<YieldActivationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const activateYield = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/v1/merchant/yield/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantId, rlusdBalance, segment, targetAPY: 0.065 }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as YieldActivationResponse
      setResult(data)
    } catch (e: any) {
      setError(e?.message ?? "Falha ao ativar Auto-Yield")
    } finally {
      setLoading(false)
    }
  }

  const getInsight = () => {
    switch (segment) {
      case "micro":
        return {
          title: "PMEs: Volume e Margem",
          points: [
            "Resolver margem e dinheiro parado",
            "Ative Auto-Yield (5%-8% APY) para transformar fluxo de caixa em rendimento",
          ],
        }
      case "mid":
        return {
          title: "Médias: Fluxo e Integração",
          points: [
            "Elimine risco de crédito e D+30 com recebimento via Escrow",
            "Gerencie capital em tempo real e aplique excedente no Módulo de Rendimento",
          ],
        }
      case "enterprise":
        return {
          title: "Grandes: Tesouraria e Compliance",
          points: [
            "Acesso antecipado a yield competitivo (mXRP) na EVM Sidechain",
            "Use Oráculos para conversão BRL↔RLUSD e carteiras efêmeras para privacidade/KYC",
          ],
        }
      default:
        return { title: "Insights", points: [] }
    }
  }

  const insight = getInsight()

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">HUB AI — Agente PAYHUB</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Otimizador de lucros 24/7: abstrai complexidade e orquestra liquidez
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Serviço Gratuito (Base) */}
      <Card className="border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Serviço Gratuito (Base)</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">Liquidez Imediata, Abstração de Pagamentos e Insights de Custo</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Escrow XRPL com liquidação garantida em RLUSD</li>
            <li>• API única que centraliza PIX, Cartão e Cripto</li>
            <li>• Arbitragem de taxas para micropagamentos (~R$ 0,0001)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Agente Premium: Rendimento DeFi */}
      <Card className="border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Agente Premium: Rendimento DeFi</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">Auto-Yield com 5%-8% APY e alocação inteligente do excedente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Merchant ID</label>
              <Input value={merchantId} onChange={(e) => setMerchantId(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Saldo RLUSD</label>
              <Input type="number" value={rlusdBalance} onChange={(e) => setRlusdBalance(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Segmento</label>
              <Select value={segment} onValueChange={(v) => setSegment(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="micro">Micro/PME</SelectItem>
                  <SelectItem value="mid">Média Empresa</SelectItem>
                  <SelectItem value="enterprise">Grande Corporação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={activateYield} disabled={loading}>
              {loading ? "Ativando..." : "Ativar Auto-Yield"}
            </Button>
            {result?.activated && (
              <Badge variant="outline" className="border-primary text-primary">Ativo</Badge>
            )}
          </div>

          {error && (
            <div className="rounded border border-destructive/40 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {result && (
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border">
                <CardHeader>
                  <CardTitle className="text-base text-foreground">Política de Alocação</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <div className="flex justify-between"><span>Hot Wallet:</span><span>{(result.allocationPolicy.hotWalletPct * 100).toFixed(0)}% — {result.allocationPolicy.hotWalletAmount.toFixed(2)} RLUSD</span></div>
                  <div className="flex justify-between"><span>Yield Pool:</span><span>{(result.allocationPolicy.yieldPct * 100).toFixed(0)}% — {result.allocationPolicy.yieldAmount.toFixed(2)} RLUSD</span></div>
                  <div className="flex justify-between"><span>Target APY:</span><span>{(result.targetAPY * 100).toFixed(1)}%</span></div>
                </CardContent>
              </Card>

              <Card className="border">
                <CardHeader>
                  <CardTitle className="text-base text-foreground">Retorno Estimado</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <div className="flex justify-between"><span>Saldo Base:</span><span>{result.metrics.rlusdBalance.toFixed(2)} RLUSD</span></div>
                  <div className="flex justify-between"><span>Diário:</span><span>{result.metrics.estimatedDailyReturn.toFixed(2)} RLUSD/dia</span></div>
                  <div className="flex justify-between"><span>Mensal:</span><span>{result.metrics.estimatedMonthlyReturn.toFixed(2)} RLUSD/mês</span></div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights por Nível de Demanda */}
      <Card className="border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Insights Personalizados</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">Consultoria embutida: foco e recomendações por porte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{insight.title}</span>
          </div>
          <ul className="space-y-2">
            {insight.points.map((p, i) => (
              <li key={i}>• {p}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}