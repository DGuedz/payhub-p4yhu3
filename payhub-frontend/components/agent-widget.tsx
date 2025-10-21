'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, X, Sparkles, Shield, Coins } from "lucide-react"

interface ChatMessage {
  role: "agent" | "user" | "system"
  text: string
}

export function AgentWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "agent",
      text:
        "Olá! Eu sou o Agente PAYHUB (HUB AI). Posso explicar rapidamente como o gateway funciona e sugerir planos: Gratuito (Liquidez imediata, abstração de pagamentos) e Premium (Auto‑Yield 5–8% APY, tesouraria inteligente). Qual deseja explorar?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [open, messages])

  function pushMessage(msg: ChatMessage) {
    setMessages((prev) => [...prev, msg])
  }

  function handlePlanSelect(plan: "free" | "premium") {
    if (plan === "free") {
      pushMessage({ role: "user", text: "Quero conhecer o plano Gratuito." })
      pushMessage({
        role: "agent",
        text:
          "Plano Gratuito: liquidez imediata via XRPL Escrow, abstração de pagamentos (PIX, Cartão, Cripto) e insights de custos. Ideal para começar sem fricção.",
      })
      pushMessage({ role: "agent", text: "Posso te mostrar a demo de pagamento ou o dashboard do comerciante." })
    } else {
      pushMessage({ role: "user", text: "Quero conhecer o plano Premium." })
      pushMessage({
        role: "agent",
        text:
          "Plano Premium: módulo de DeFi Yield com Auto‑Yield 5–8% APY (mXRP na XRPL EVM Sidechain), alocação inteligente de risco e relatórios de tesouraria.",
      })
      pushMessage({
        role: "agent",
        text: "Deseja simular a ativação de Auto‑Yield agora? Clique em 'Ativar Auto-Yield'.",
      })
    }
  }

  async function activateAutoYield() {
    try {
      setLoading(true)
      pushMessage({ role: "user", text: "Ativar Auto‑Yield" })
      const res = await fetch("/api/v1/merchant/yield/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segment: "micro", rlusdBalance: 10000 }),
      })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      const apyPct = typeof data?.targetAPY === "number" ? (data.targetAPY * 100).toFixed(1) : undefined
      const policy = data?.allocationPolicy || {}
      const metrics = data?.metrics || {}
      const yieldPct = typeof policy?.yieldPct === "number" ? (policy.yieldPct * 100).toFixed(0) : undefined
      const yieldAmount = typeof policy?.yieldAmount === "number" ? policy.yieldAmount.toFixed(2) : undefined
      const monthly = typeof metrics?.estimatedMonthlyReturn === "number" ? metrics.estimatedMonthlyReturn.toFixed(2) : undefined
      const daily = typeof metrics?.estimatedDailyReturn === "number" ? metrics.estimatedDailyReturn.toFixed(2) : undefined
      pushMessage({
        role: "agent",
        text:
          `Auto‑Yield ativado (simulação): Alocado ${yieldPct ?? "?"}% no pool (≈ ${yieldAmount ?? "?"} RLUSD). APY alvo ${apyPct ?? "?"}%. Ganhos estimados: R$ ${monthly ?? "?"}/mês (~R$ ${daily ?? "?"}/dia).`,
      })
    } catch (e) {
      pushMessage({ role: "agent", text: "Não consegui ativar agora. Tente novamente em instantes." })
    } finally {
      setLoading(false)
    }
  }

  function handleSend() {
    const text = input.trim()
    if (!text) return
    pushMessage({ role: "user", text })
    setInput("")

    // Respostas simples e úteis
    const lower = text.toLowerCase()
    if (lower.includes("plano") || lower.includes("premium") || lower.includes("yield")) {
      pushMessage({
        role: "agent",
        text:
          "Temos dois níveis: Gratuito (liquidez imediata, pagamento unificado) e Premium (Auto‑Yield 5–8% APY). Você quer ver detalhes do Gratuito ou do Premium?",
      })
      return
    }
    if (lower.includes("preco") || lower.includes("valor") || lower.includes("custo")) {
      pushMessage({ role: "agent", text: "Plano Gratuito sem custo. Premium com taxa de performance sobre ganhos (modelo de simulação)." })
      return
    }
    if (lower.includes("como funciona") || lower.includes("funciona")) {
      pushMessage({
        role: "agent",
        text:
          "PAYHUB abstrai pagamentos (PIX, Cartão, Cripto) e liquida via XRPL Escrow (D+0, custo baixo). Opcionalmente, capital pode gerar rendimento com risco controlado.",
      })
      return
    }

    // Default
    pushMessage({ role: "agent", text: "Posso te orientar sobre planos e a demo. Você prefere começar pelo Gratuito ou Premium?" })
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground"
          aria-label="Abrir Agente PAYHUB"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[380px]">
          <Card className="bg-white border shadow-xl rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-gray-900">Agente PAYHUB</div>
                  <div className="text-xs text-gray-500">HUB AI • Pagamentos & Tesouraria</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Fechar">
                <X className="h-5 w-5 text-gray-700" />
              </Button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="max-h-80 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`text-sm ${m.role === "user" ? "text-gray-900" : "text-gray-700"}`}>
                  <div
                    className={`inline-block rounded-lg px-3 py-2 ${
                      m.role === "user" ? "bg-gray-100" : "bg-gray-50"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Quick actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handlePlanSelect("free")}>Plano Gratuito</Button>
                <Button size="sm" onClick={() => handlePlanSelect("premium")}>Plano Premium</Button>
                <Button size="sm" variant="secondary" onClick={activateAutoYield} disabled={loading}>
                  <Coins className="h-4 w-4 mr-1" /> Ativar Auto‑Yield
                </Button>
              </div>

              {/* Highlights */}
              <div className="pt-2 text-xs text-gray-500 flex items-center gap-2">
                <Shield className="h-3 w-3" /> Escrow XRPL • D+0 • custo ~R$0,0001
              </div>
            </div>

            {/* Composer */}
            <div className="p-3 border-t flex items-center gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend()
                }}
              />
              <Button onClick={handleSend} disabled={loading}>Enviar</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}