import { PayhubDemo } from "@/components/payhub-demo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Shield, TrendingUp, ArrowRight, Wallet, CreditCard, Coins, ArrowRightLeft } from "lucide-react"
import { HubAIAgent } from "@/components/hub-ai-agent"
import { TransactionSimulator } from "@/components/transaction-simulator"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-3">
            <Shield className="mr-1 h-3 w-3" />
            Demo Test • Journey Overview
          </Badge>
          <h1 className="text-4xl font-bold text-foreground">
            Teste de Conexão Simulado
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-3xl mx-auto">
            Demonstração da Jornada Fluida do Agente de Gestão de Liquidez Ativa —
            extensão visual e UX da Home.
          </p>
        </div>

        {/* Fases da Jornada */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {/* Fase 1 */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary">Fase 1: Configuração e Ativação</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Onboarding simplificado: carteira XRPL segura e fundeada (rMERCHANT_…)</li>
                <li>• Ativação Tesouraria Ativa e Auto‑Yield 5–8% APY</li>
                <li>• Integração única: API Key ou Widget plug‑and‑play</li>
                <li><code className="text-xs">POST /api/v1/merchant/yield/activate</code></li>
                <li>• API Gateway (HUB)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Fase 2 */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary">Fase 2: Pagamento Híbrido</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Cliente paga: Cartão 10x ou PIX (R$)</li>
                <li>• Conversão Fiat → RLUSD com privacidade em 1º lugar</li>
                <li>• Escrow trustless: bloqueio on‑chain em RLUSD</li>
                <li><code className="text-xs">POST /escrow/rlusd/create</code> • <code className="text-xs">POST /escrow/rlusd/finish</code></li>
                <li><code className="text-xs">POST /simulate/hybrid</code></li>
              </ul>
            </CardContent>
          </Card>

          {/* Fase 3 */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary">Fase 3: Valor Agregado</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Crescimento do capital de giro (mXRP na EVM Sidechain, 5–8% APY)</div>
                <div>• Saldo RLUSD Base: 10.000,00 • Rendimento (6,5% APY): +54,17 • Total: 10.054,17</div>
                <div><code className="text-xs">POST /api/v1/merchant/yield/allocate</code></div>
                <div>• Abstração cripto • Segurança XRPL Escrow • Liquidez imediata (~R$0,0001)</div>
                <div>• HUB AI — Agente PAYHUB: otimiza lucros 24/7</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agente Premium: Rendimento DeFi */}
        <Card className="border-2 border-primary/20 mb-12">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Coins className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary">Agente Premium: Rendimento DeFi</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Consultoria embutida por porte (PMEs: foco em volume e margem).
              Resolva dinheiro parado e ative Auto‑Yield para transformar fluxo de caixa em rendimento.
            </p>
            {/* Widget de ativação com Merchant ID/Saldo/Segmento */}
            <HubAIAgent />
          </CardContent>
        </Card>

        {/* Componente Principal de Demo */}
        <section className="container mx-auto max-w-5xl space-y-8">
          {/* Jornada PAYHUB */}
          <PayhubDemo />

          {/* Simulador */}
          <div className="mt-8">
            <TransactionSimulator />
          </div>
        </section>

        {/* Benefícios Comprovados */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Benefícios Comprovados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">0%</div>
                <div className="text-sm text-muted-foreground">Risco de Crédito</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">R$0.0001</div>
                <div className="text-sm text-muted-foreground">Custo por Transação</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">D+0</div>
                <div className="text-sm text-muted-foreground">Liquidação</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">5-8%</div>
                <div className="text-sm text-muted-foreground">APY Automático</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}