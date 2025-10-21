'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Shield, TrendingUp, ArrowRight } from "lucide-react"
import { HubAIAgent } from "@/components/hub-ai-agent"
import { Badge } from "@/components/ui/badge"
import { TransactionSimulator } from "@/components/transaction-simulator"

export default function DemoSimplePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold">
                  Teste de Conexão Simulado
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Demonstração da Jornada Fluida do Agente de Gestão de Liquidez Ativa
              </p>
              <Badge variant="outline" className="mx-auto">XRPL Testnet</Badge>
            </div>

        <div className="space-y-6">
          {/* Fase 1: Configuração e Ativação */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold">1</div>
                <CardTitle>Fase 1: Configuração e Ativação</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border border-muted">
                  <CardHeader>
                    <CardTitle className="text-lg">Onboarding Simplificado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription>
                      O PAYHUB gera automaticamente uma carteira XRPL segura e fundeada para o recebimento.
                    </CardDescription>
                    <div className="bg-primary/10 border border-primary/30 rounded p-3">
                      <code className="text-primary text-xs">rMERCHANT_... (Endereço Web3)</code>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted">
                  <CardHeader>
                    <CardTitle className="text-lg">Ativação da Tesouraria Ativa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription>
                      Ativação do Rendimento Automático (Auto-Yield) com 5-8% APY.
                    </CardDescription>
                    <div className="bg-primary/10 border border-primary/30 rounded p-3">
                      <code className="text-primary text-xs">POST /api/v1/merchant/yield/activate</code>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted">
                  <CardHeader>
                    <CardTitle className="text-lg">Integração Única</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription>
                      API Key Única ou Widget plug-and-play que orquestra Pix, Cartão e Cripto.
                    </CardDescription>
                    <div className="bg-primary/10 border border-primary/30 rounded p-3">
                      <code className="text-primary text-xs">API Gateway (HUB)</code>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Fase 2: Pagamento Híbrido */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold">2</div>
                <CardTitle>Fase 2: Pagamento Híbrido e Liquidação Atômica</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="border border-muted">
                  <CardHeader>
                    <CardTitle className="text-base">Cliente Paga</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardDescription className="text-sm">Cartão 10x ou PIX em R$</CardDescription>
                    <code className="text-xs text-primary bg-muted p-2 rounded block">/simulate/hybrid</code>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted">
                  <CardHeader>
                    <CardTitle className="text-base">Conversão</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardDescription className="text-sm">Fiat → RLUSD (Stablecoin)</CardDescription>
                    <code className="text-xs text-primary bg-muted p-2 rounded block">Privacidade em 1º lugar</code>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted">
                  <CardHeader>
                    <CardTitle className="text-base">Escrow Trustless</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardDescription className="text-sm">Bloqueio on-chain em RLUSD</CardDescription>
                    <code className="text-xs text-primary bg-muted p-2 rounded block">POST /escrow/rlusd/create</code>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted">
                  <CardHeader>
                    <CardTitle className="text-base">Recebimento Imediato</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardDescription className="text-sm">À vista após entrega</CardDescription>
                    <code className="text-xs text-primary bg-muted p-2 rounded block">POST /escrow/rlusd/finish</code>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            {/* Painel de Simulação */}
            <div className="mt-4">
              <TransactionSimulator />
            </div>
          </Card>

          {/* Fase 3: Valor Agregado */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold">3</div>
                <CardTitle>Fase 3: Demonstração do Valor Agregado</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border border-muted">
                  <CardHeader>
                    <CardTitle className="text-lg">Crescimento do Capital de Giro</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>
                      Alocação em protocolos de yield (mXRP na EVM Sidechain) com 5-8% APY.
                    </CardDescription>
                    <div className="bg-primary/10 border border-primary/30 rounded p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span>Saldo RLUSD Base:</span>
                        <span className="font-mono">10,000.00</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-primary">+ Rendimento (6.5% APY):</span>
                        <span className="text-primary font-mono">+54.17</span>
                      </div>
                      <hr className="border-primary/30 my-2" />
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total:</span>
                        <span className="font-mono font-bold">10,054.17</span>
                      </div>
                    </div>
                    <code className="text-xs text-primary bg-muted p-2 rounded block">POST /api/v1/merchant/yield/allocate</code>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted">
                  <CardHeader>
                    <CardTitle className="text-lg">Benefícios Comprovados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <Shield className="h-5 w-5 text-primary mr-3" />
                        <span className="text-sm">Abstração total de complexidade cripto</span>
                      </li>
                      <li className="flex items-center">
                        <Zap className="h-5 w-5 text-primary mr-3" />
                        <span className="text-sm">Segurança via XRPL Escrow nativo</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-primary mr-3" />
                        <span className="text-sm">Liquidez imediata com custo XRPL (~R$0,0001)</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="h-5 w-5 text-primary mr-3" />
                        <span className="text-sm">Transformação em investidor passivo</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              {/* HUB AI Component */}
              <div className="mt-8">
                <HubAIAgent />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  </main>
</div>
  )
}