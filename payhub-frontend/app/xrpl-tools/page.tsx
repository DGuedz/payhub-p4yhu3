"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getXRPLClient, XRPL_NETWORKS, type XRPLNetwork } from "@/lib/xrpl-client"
import { Globe, Zap, Construction, Wallet } from "lucide-react"

export default function XRPLToolsPage() {
  const xrpl = useMemo(() => getXRPLClient(), [])
  const [network, setNetwork] = useState<XRPLNetwork>("testnet")
  const urls = XRPL_NETWORKS[network]

  const [genLoading, setGenLoading] = useState(false)
  const [topupLoading, setTopupLoading] = useState(false)

  const [generated, setGenerated] = useState<{ address: string; secret: string; balance: string } | null>(null)
  const [topupAddress, setTopupAddress] = useState("")
  const [topupAmount, setTopupAmount] = useState<string>("")
  const [topupResult, setTopupResult] = useState<null | { ok: boolean }>(null)

  useEffect(() => {
    xrpl.setNetwork(network).catch(() => {})
  }, [network, xrpl])

  async function handleGenerate() {
    setGenLoading(true)
    setGenerated(null)
    try {
      const res = await xrpl.faucetGenerateAccount(network)
      setGenerated(res)
    } finally {
      setGenLoading(false)
    }
  }

  async function handleTopUp() {
    if (!topupAddress) return
    setTopupLoading(true)
    setTopupResult(null)
    try {
      const ok = await xrpl.faucetTopUp(topupAddress, topupAmount ? Number(topupAmount) : undefined, network)
      setTopupResult({ ok })
    } finally {
      setTopupLoading(false)
    }
  }

  const hasFaucet = Boolean(urls.faucet)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Globe className="h-3 w-3" /> XRPL Dev Tools
            </Badge>
            <span className="text-xs text-muted-foreground">Escolha a rede e use o Faucet</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Seleção de Rede</CardTitle>
              <CardDescription>Testnet, Devnet, Xahau-Testnet, Batch-Devnet</CardDescription>
            </CardHeader>
            <CardContent>
              <label className="mb-2 block text-sm font-medium">Rede</label>
              <select
                className="w-full rounded-md border border-border bg-card p-2 text-sm"
                value={network}
                onChange={(e) => setNetwork(e.target.value as XRPLNetwork)}
              >
                <option value="testnet">Testnet (Mainnet-like)</option>
                <option value="devnet">Devnet (Preview)</option>
                <option value="xahau-testnet">Xahau-Testnet (Hooks L1)</option>
                <option value="batch-devnet">Batch-Devnet (XLS-56d)</option>
              </select>

              <div className="mt-4 space-y-2 text-sm">
                <div>
                  <span className="font-mono text-xs">WebSocket</span>
                  <div className="rounded bg-muted px-3 py-2 font-mono text-xs">{urls.ws}</div>
                </div>
                <div>
                  <span className="font-mono text-xs">JSON-RPC</span>
                  <div className="rounded bg-muted px-3 py-2 font-mono text-xs">{urls.rpc}</div>
                </div>
                {!hasFaucet && (
                  <div className="text-xs text-muted-foreground">Esta rede não possui faucet disponível neste painel.</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <CardTitle>Faucet: Gerar Credenciais</CardTitle>
              </div>
              <CardDescription>Gera endereço/secret e credita automaticamente na rede selecionada</CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled={!hasFaucet || genLoading} onClick={handleGenerate}>
                {genLoading ? "Gerando…" : "Gerar credenciais"}
              </Button>
              {generated && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs">Endereço</div>
                  <div className="rounded bg-muted px-3 py-2 font-mono text-xs break-all">{generated.address}</div>
                  <div className="text-xs">Secret</div>
                  <div className="rounded bg-muted px-3 py-2 font-mono text-xs break-all">{generated.secret}</div>
                  <div className="text-xs">Saldo inicial (XRP)</div>
                  <div className="rounded bg-muted px-3 py-2 font-mono text-xs">{generated.balance}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Faucet: Recarregar Endereço</CardTitle>
              </div>
              <CardDescription>Credita um endereço existente na Testnet/Devnet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input
                  placeholder="rXXXXXXXX…"
                  value={topupAddress}
                  onChange={(e) => setTopupAddress(e.target.value)}
                />
                <Input
                  placeholder="Quantidade (opcional)"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                />
                <Button disabled={!hasFaucet || topupLoading || !topupAddress} onClick={handleTopUp}>
                  {topupLoading ? "Recarregando…" : "Recarregar"}
                </Button>
                {topupResult && (
                  <div className="text-xs text-muted-foreground">
                    {topupResult.ok ? "Recarregado com sucesso." : "Falha ao recarregar."}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referências Rápidas</CardTitle>
              <CardDescription>Ferramentas úteis da XRPL</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>
                  <a className="text-primary hover:underline" href="https://xrpl.org/resources/dev-tools/xrp-faucets" target="_blank" rel="noreferrer">
                    XRP Faucets
                  </a>
                </li>
                <li>
                  <a className="text-primary hover:underline" href="https://s.altnet.rippletest.net:51234/" target="_blank" rel="noreferrer">
                    Testnet JSON-RPC
                  </a>
                </li>
                <li>
                  <a className="text-primary hover:underline" href="https://s.devnet.rippletest.net:51234/" target="_blank" rel="noreferrer">
                    Devnet JSON-RPC
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}