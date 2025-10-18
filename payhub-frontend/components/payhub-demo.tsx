"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, Clock, DollarSign, TrendingUp, Shield, Zap, ArrowRight } from "lucide-react"

interface DemoStep {
  id: string
  title: string
  description: string
  status: "pending" | "running" | "completed" | "error"
  duration: number
}

interface PaymentFlow {
  customerMethod: string
  merchantReceives: string
  amount: number
  fees: number
  apy: number
  escrowSequence?: number
}

export default function PayhubDemo() {
  const [currentPhase, setCurrentPhase] = useState<"setup" | "payment" | "yield" | "completed">("setup")
  const [steps, setSteps] = useState<DemoStep[]>([
    {
      id: "wallet",
      title: "Geração de Carteira XRPL",
      description: "Criando carteira segura para o comerciante",
      status: "pending",
      duration: 2000
    },
    {
      id: "trustline",
      title: "Configuração de Trustlines",
      description: "Estabelecendo trustlines para RLUSD",
      status: "pending",
      duration: 1500
    },
    {
      id: "issuance",
      title: "Emissão de RLUSD",
      description: "Emitindo stablecoin para liquidez inicial",
      status: "pending",
      duration: 2500
    },
    {
      id: "hybrid-payment",
      title: "Processamento Híbrido",
      description: "Cliente paga em reais, comerciante recebe em crypto",
      status: "pending",
      duration: 3000
    },
    {
      id: "escrow",
      title: "Bloqueio em Escrow",
      description: "Garantindo transação com escrow trustless",
      status: "pending",
      duration: 2000
    },
    {
      id: "settlement",
      title: "Liquidação Imediata",
      description: "Recebimento à vista em RLUSD",
      status: "pending",
      duration: 1500
    },
    {
      id: "yield",
      title: "Ativação de Rendimento",
      description: "Capital de giro gerando 5-8% APY automaticamente",
      status: "pending",
      duration: 2500
    }
  ])

  const [paymentFlow, setPaymentFlow] = useState<PaymentFlow>({
    customerMethod: "Cartão de Crédito - 10x sem juros",
    merchantReceives: "RLUSD (Stablecoin)",
    amount: 1000.00,
    fees: 15.00,
    apy: 6.5
  })

  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Simular alocação de rendimento DeFi
  const handleDefiAllocation = async () => {
    try {
      // Simulação local - removendo dependência do backend
      console.log('Alocando rendimento DeFi...');
      
      setTimeout(() => {
        setDefiAllocation({
          protocol: 'mXRP_EVM_Sidechain',
          apy: 6.5,
          allocatedAmount: currentBalance * 0.8,
          estimatedReturn: (currentBalance * 0.8 * 0.065) / 12
        });
      }, 1500);
    } catch (error) {
      console.error('Erro na alocação DeFi:', error);
      setDefiAllocation({
        protocol: 'mXRP_EVM_Sidechain',
        apy: 6.5,
        allocatedAmount: currentBalance * 0.8,
        estimatedReturn: (currentBalance * 0.8 * 0.065) / 12
      });
    }
  };

  // Simular execução da demo sem backend
  const runDemo = async () => {
    setIsRunning(true)
    setCurrentPhase("setup")
    setProgress(0)

    // Fase 1: Setup
    const setupSteps = ["wallet", "trustline", "issuance"]
    for (let i = 0; i < setupSteps.length; i++) {
      const stepId = setupSteps[i]
      setSteps(prev => prev.map(step => 
        step.id === stepId ? { ...step, status: "running" } : step
      ))
      
      await new Promise(resolve => setTimeout(resolve, steps.find(s => s.id === stepId)?.duration || 2000))
      
      setSteps(prev => prev.map(step => 
        step.id === stepId ? { ...step, status: "completed" } : step
      ))
      
      setProgress(((i + 1) / setupSteps.length) * 100)
    }

    // Fase 2: Pagamento Híbrido
    setCurrentPhase("payment")
    const paymentSteps = ["hybrid-payment", "escrow", "settlement"]
    
    for (let i = 0; i < paymentSteps.length; i++) {
      const stepId = paymentSteps[i]
      setSteps(prev => prev.map(step => 
        step.id === stepId ? { ...step, status: "running" } : step
      ))
      
      if (stepId === "escrow") {
        // Simular criação de escrow com sequence
        console.log('Processando pagamento híbrido...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        setPaymentFlow(prev => ({ ...prev, escrowSequence: Math.floor(Math.random() * 1000000) }))
      } else {
        await new Promise(resolve => setTimeout(resolve, steps.find(s => s.id === stepId)?.duration || 2000))
      }
      
      setSteps(prev => prev.map(step => 
        step.id === stepId ? { ...step, status: "completed" } : step
      ))
      
      setProgress(33 + (((i + 1) / paymentSteps.length) * 33))
    }

    // Fase 3: Rendimento
    setCurrentPhase("yield")
    const yieldStep = steps.find(s => s.id === "yield")!
    
    setSteps(prev => prev.map(step => 
      step.id === "yield" ? { ...step, status: "running" } : step
    ))
    
    await new Promise(resolve => setTimeout(resolve, yieldStep.duration))
    
    setSteps(prev => prev.map(step => 
      step.id === "yield" ? { ...step, status: "completed" } : step
    ))
    
    setProgress(100)
    setCurrentPhase("completed")
    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "running":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getPhaseTitle = () => {
    switch (currentPhase) {
      case "setup":
        return "Fase 1: Configuração e Ativação"
      case "payment":
        return "Fase 2: Pagamento Híbrido e Liquidação"
      case "yield":
        return "Fase 3: Gestão de Liquidez Ativa"
      case "completed":
        return "✅ Jornada Completa - PAYHUB Ativo"
      default:
        return "Preparando Demo"
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Zap className="h-6 w-6 text-purple-400" />
                PAYHUB - Agente de Gestão de Liquidez Ativa
              </CardTitle>
              <CardDescription className="text-purple-200">
                Demonstração do Fluxo de Pagamento Híbrido com Abstração Total
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-purple-400 text-purple-300">
              MVP XRPL
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status da Fase Atual */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{getPhaseTitle()}</h3>
              {currentPhase === "completed" && (
                <Badge className="bg-green-600">Sistema Ativo</Badge>
              )}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Resumo do Fluxo de Pagamento */}
          <Card className="bg-slate-800/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-purple-400" />
                Fluxo de Pagamento Híbrido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-gray-300 mb-1">Cliente Paga</div>
                  <div className="font-semibold text-white">{paymentFlow.customerMethod}</div>
                  <div className="text-2xl font-bold text-green-400 mt-2">
                    R$ {paymentFlow.amount.toFixed(2)}
                  </div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-gray-300 mb-1">Comerciante Recebe</div>
                  <div className="font-semibold text-white">{paymentFlow.merchantReceives}</div>
                  <div className="text-2xl font-bold text-purple-400 mt-2">
                    {(paymentFlow.amount - paymentFlow.fees).toFixed(2)}
                  </div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-gray-300 mb-1">Rendimento APY</div>
                  <div className="font-semibold text-white">Automático</div>
                  <div className="text-2xl font-bold text-yellow-400 mt-2">
                    {paymentFlow.apy}%
                  </div>
                </div>
              </div>
              
              {paymentFlow.escrowSequence && (
                <div className="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-green-300">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-mono">
                      Escrow Sequence: {paymentFlow.escrowSequence}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Steps da Jornada */}
          <div className="space-y-3">
            <h4 className="font-semibold text-purple-300">Jornada do Usuário</h4>
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg">
                <div className="flex-shrink-0">
                  {getStatusIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-sm text-gray-300">{step.description}</div>
                </div>
                <div className="text-xs text-gray-400">
                  {step.status === "completed" && "✓ Concluído"}
                  {step.status === "running" && "Em execução..."}
                  {step.status === "pending" && "Aguardando"}
                </div>
              </div>
            ))}
          </div>

          {/* Botão de Controle */}
          <div className="flex justify-center">
            <Button
              onClick={runDemo}
              disabled={isRunning}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
            >
              {isRunning ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Executando Demo...
                </>
              ) : currentPhase === "completed" ? (
                "🔄 Reiniciar Demo"
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Iniciar Demo Completa
                </>
              )}
            </Button>
          </div>

          {/* Benefícios do PAYHUB */}
          {currentPhase === "completed" && (
            <Card className="bg-gradient-to-r from-green-900/30 to-purple-900/30 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  PAYHUB Transformou Seu Negócio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span>Liquidez Imediata: Recebimento à vista</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span>Zero Risco de Crédito: Escrow trustless</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span>Taxas Reduzidas: XRPL custo quase zero</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-400" />
                      <span>Rendimento Automático: 5-8% APY</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-400" />
                      <span>Abstração Total: Cliente não vê crypto</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-400" />
                      <span>Flexibilidade: Parcelamento tradicional</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}