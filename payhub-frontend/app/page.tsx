import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Shield, Zap, Globe, Lock, Wallet, CreditCard, Coins, ArrowRightLeft } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Shield className="mr-1 h-3 w-3" />
            Privacy-First Payment Gateway
          </Badge>
          <h1 className="mb-6 text-balance text-5xl font-bold leading-tight text-foreground md:text-6xl">
            Bridge Traditional & Web3 Payments with <span className="text-primary">Zero Friction</span>
          </h1>
          <p className="mb-8 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            PAYHUB unifies PIX, Credit Cards, and Crypto payments into a single abstraction layer. Customers pay in
            their preferred method while merchants receive instant crypto liquidity via XRPL Escrow.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/payment">
                Try Payment Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/merchant">View Merchant Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">How PAYHUB Works</h2>
          <p className="text-lg text-muted-foreground">
            Two payment flows designed for maximum flexibility and privacy
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Hybrid Payment Flow */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary">Hybrid Flow</Badge>
              </div>
              <CardTitle>Traditional Payment → Crypto Settlement</CardTitle>
              <CardDescription>For non-crypto users paying with PIX or Credit Card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    1
                  </div>
                  <p className="text-sm text-muted-foreground">Customer pays in BRL via PIX or Credit Card</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    2
                  </div>
                  <p className="text-sm text-muted-foreground">PAYHUB creates ephemeral wallet for privacy</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    3
                  </div>
                  <p className="text-sm text-muted-foreground">Fiat converted to RLUSD stablecoin behind the scenes</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    4
                  </div>
                  <p className="text-sm text-muted-foreground">Merchant receives instant crypto via XRPL Escrow</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crypto-Native Flow */}
          <Card className="border-2 border-secondary/20">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                  <Wallet className="h-5 w-5 text-secondary" />
                </div>
                <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                  Crypto Flow
                </Badge>
              </div>
              <CardTitle>Direct Crypto Payment</CardTitle>
              <CardDescription>For Web3-native users with connected wallets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                    1
                  </div>
                  <p className="text-sm text-muted-foreground">Customer connects Web3 wallet (MetaMask, Rainbow)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                    2
                  </div>
                  <p className="text-sm text-muted-foreground">Pays directly with XRP or Stablecoins</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                    3
                  </div>
                  <p className="text-sm text-muted-foreground">Transaction signed and settled on XRPL</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                    4
                  </div>
                  <p className="text-sm text-muted-foreground">Merchant receives payment instantly via Escrow</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Privacy-First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Ephemeral wallets and account abstraction ensure customer privacy while maintaining compliance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle>Instant Settlement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                XRPL Escrow mechanism provides trustless, instant liquidity to merchants without intermediaries.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <ArrowRightLeft className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle>Payment Abstraction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Unified API routes optimal payment paths automatically. One integration, all payment methods.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Coins className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="mb-3 text-3xl font-bold text-foreground">Ready to Test PAYHUB?</h2>
              <p className="text-lg text-muted-foreground">
                Experience the future of payment abstraction with our interactive simulation
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/payment">
                  Start Payment Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/merchant">Merchant Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <span className="font-mono text-xs font-bold text-primary-foreground">P4Y</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">PAYHUB © 2025 - Payment Simulation</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">
                Documentation
              </Link>
              <Link href="/merchant" className="text-sm text-muted-foreground hover:text-foreground">
                Merchant Portal
              </Link>
              <Badge variant="outline" className="gap-1">
                <Globe className="h-3 w-3" />
                XRPL Testnet
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
