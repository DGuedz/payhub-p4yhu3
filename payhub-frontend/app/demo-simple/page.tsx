import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Shield, TrendingUp, ArrowRight } from "lucide-react"

export default function DemoSimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-purple-600/20 p-3 rounded-full">
              <Zap className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Teste de Conexão Simulado
            </h1>
          </div>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Demonstração da Jornada Fluida do Agente de Gestão de Liquidez Ativa
          </p>
        </div>

        <div className="space-y-6">
          {/* Fase 1: Configuração e Ativação */}
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1</div>
                <CardTitle className="text-white">Fase 1: Configuração e Ativação</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-slate-800/30 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-blue-300 text-lg">Onboarding Simplificado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription className="text-gray-300">
                      O PAYHUB gera automaticamente uma carteira XRPL segura e fundeada para o recebimento.
                    </CardDescription>
                    <div className="bg-green-500/20 border border-green-500/50 rounded p-3">
                      <code className="text-green-300 text-xs">rMERCHANT_... (Endereço Web3)</code>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/30 border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="text-yellow-300 text-lg">Ativação da Tesouraria Ativa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription className="text-gray-300">
                      Ativação do Rendimento Automático (Auto-Yield) com 5-8% APY.
                    </CardDescription>
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-3">
                      <code className="text-yellow-300 text-xs">POST /api/v1/merchant/yield/activate</code>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/30 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-purple-300 text-lg">Integração Única</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription className="text-gray-300">
                      API Key Única ou Widget plug-and-play que orquestra Pix, Cartão e Cripto.
                    </CardDescription>
                    <div className="bg-purple-500/20 border border-purple-500/50 rounded p-3">
                      <code className="text-purple-300 text-xs">API Gateway (HUB)</code>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Fase 2: Pagamento Híbrido */}
          <Card className="bg-slate-800/50 border-green-500/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">2</div>
                <CardTitle className="text-white">Fase 2: Pagamento Híbrido e Liquidação Atômica</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="bg-slate-800/30 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-300 text-base">Cliente Paga</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardDescription className="text-gray-300 text-sm">Cartão 10x ou PIX em R$</CardDescription>
                    <code className="text-xs text-green-300 bg-slate-900/50 p-2 rounded block">/simulate/hybrid</code>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/30 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-orange-300 text-base">Conversão</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardDescription className="text-gray-300 text-sm">Fiat → RLUSD (Stablecoin)</CardDescription>
                    <code className="text-xs text-orange-300 bg-slate-900/50 p-2 rounded block">Privacidade em 1º lugar</code>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/30 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-red-300 text-base">Escrow Trustless</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardDescription className="text-gray-300 text-sm">Bloqueio on-chain em RLUSD</CardDescription>
                    <code className="text-xs text-red-300 bg-slate-900/50 p-2 rounded block">POST /escrow/rlusd/create</code>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/30 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-blue-300 text-base">Recebimento Imediato</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardDescription className="text-gray-300 text-sm">À vista após entrega</CardDescription>
                    <code className="text-xs text-blue-300 bg-slate-900/50 p-2 rounded block">POST /escrow/rlusd/finish</code>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Fase 3: Valor Agregado */}
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">3</div>
                <CardTitle className="text-white">Fase 3: Demonstração do Valor Agregado</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/30 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-purple-300 text-lg">Crescimento do Capital de Giro</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-gray-300">
                      Alocação em protocolos de yield (mXRP na EVM Sidechain) com 5-8% APY.
                    </CardDescription>
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-purple-300">Saldo RLUSD Base:</span>
                        <span className="text-white font-mono">10,000.00</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-green-300">+ Rendimento (6.5% APY):</span>
                        <span className="text-green-300 font-mono">+54.17</span>
                      </div>
                      <hr className="border-purple-500/30 my-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300 font-semibold">Total:</span>
                        <span className="text-white font-mono font-bold">10,054.17</span>
                      </div>
                    </div>
                    <code className="text-xs text-purple-300 bg-slate-900/50 p-2 rounded block">POST /api/v1/merchant/yield/allocate</code>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/30 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-blue-300 text-lg">Benefícios Comprovados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm">Abstração total de complexidade cripto</span>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm">Segurança via XRPL Escrow nativo</span>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm">Liquidez imediata com custo XRPL (~R$0,0001)</span>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm">Transformação em investidor passivo</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">0%</div>
                  <div className="text-sm text-gray-300">Risco de Crédito</div>
                </Card>
                <Card className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">R$0.0001</div>
                  <div className="text-sm text-gray-300">Custo por Transação</div>
                </Card>
                <Card className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">D+0</div>
                  <div className="text-sm text-gray-300">Liquidação</div>
                </Card>
                <Card className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">5-8%</div>
                  <div className="text-sm text-gray-300">APY Automático</div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl inline-block">
            <h3 className="text-xl font-bold mb-2">✅ MVP Comprovado</h3>
            <p className="text-blue-100">
              O PAYHUB transforma complexidade DeFi/XRPL em benefícios de negócio simples, 
              funcionando como um Agente de Gestão de Liquidez Ativa para o comerciante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}