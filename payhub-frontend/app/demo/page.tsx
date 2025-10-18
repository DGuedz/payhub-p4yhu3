import PayhubDemo from "@/components/payhub-demo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Shield, TrendingUp, ArrowRight } from "lucide-react"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-purple-600/20 p-3 rounded-full">
              <Zap className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Teste de Conexão Simulada
            </h1>
          </div>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Demonstração do PAYHUB como Agente de Gestão de Liquidez Ativa - 
            Transformando complexidade em simplicidade
          </p>
        </div>

        {/* Benefícios em Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-purple-400" />
                <CardTitle className="text-white">Segurança Trustless</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-purple-200">
                XRPL Escrow garante que fundos sejam bloqueados e liberados 
                apenas após confirmação do serviço
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-green-400" />
                <CardTitle className="text-white">Rendimento Automático</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-purple-200">
                Capital de giro gera 5-8% APY automaticamente através 
                de protocolos DeFi na XRPL Sidechain
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <ArrowRight className="h-6 w-6 text-blue-400" />
                <CardTitle className="text-white">Abstração Total</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-purple-200">
                Cliente paga com métodos tradicionais, comerciante recebe 
                em crypto - complexidade totalmente oculta
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Componente Principal de Demo */}
        <PayhubDemo />

        {/* Informações Técnicas */}
        <div className="mt-8 space-y-6">
          <Card className="bg-slate-800/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-400" />
                Arquitetura PAYHUB
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-300">Endpoints Implementados</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <code className="text-green-400">POST /api/v1/merchant/yield/activate</code>
                      <Badge variant="outline" className="text-green-400 border-green-400">Ativo</Badge>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-blue-400">POST /escrow/rlusd/create</code>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">Ativo</Badge>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-purple-400">POST /escrow/rlusd/finish</code>
                      <Badge variant="outline" className="text-purple-400 border-purple-400">Ativo</Badge>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-yellow-400">POST /simulate/hybrid</code>
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400">Ativo</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-300">Componentes Frontend</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">PaymentOrchestrator</span>
                      <Badge variant="outline" className="text-gray-400">Integrado</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">XRPLSimulator</span>
                      <Badge variant="outline" className="text-gray-400">Integrado</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Escrow Monitor</span>
                      <Badge variant="outline" className="text-gray-400">Integrado</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Yield Manager</span>
                      <Badge variant="outline" className="text-gray-400">Integrado</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas do Sistema */}
          <Card className="bg-gradient-to-r from-green-900/20 to-purple-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Benefícios Comprovados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">0%</div>
                  <div className="text-sm text-gray-300">Risco de Crédito</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">R$0.0001</div>
                  <div className="text-sm text-gray-300">Custo por Transação</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">D+0</div>
                  <div className="text-sm text-gray-300">Liquidação</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-400">5-8%</div>
                  <div className="text-sm text-gray-300">APY Automático</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}