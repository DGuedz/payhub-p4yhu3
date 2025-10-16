"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getPaymentOrchestrator, type PaymentResult } from "@/lib/payment-orchestrator"
import { CreditCard, Smartphone, Wallet, ArrowRight, CheckCircle2, Loader2, Info } from "lucide-react"
import { EscrowMonitor } from "@/components/escrow-monitor"

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card" | "crypto">("pix")
  const [amount, setAmount] = useState("100.00")
  const [merchantAddress, setMerchantAddress] = useState("rMERCHANT_DEMO_ADDRESS")
  const [cryptoAsset, setCryptoAsset] = useState<"XRP" | "RLUSD" | "USDC">("RLUSD")
  const [customerWallet, setCustomerWallet] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentResult(null)

    try {
      const orchestrator = getPaymentOrchestrator()

      let result: PaymentResult

      if (paymentMethod === "crypto") {
        // Crypto-native flow
        result = await orchestrator.processCryptoPayment({
          amount: Number.parseFloat(amount),
          merchantAddress,
          paymentMethod,
          cryptoAsset,
          customerWallet: customerWallet || `rCUSTOMER_${Math.random().toString(36).substring(7).toUpperCase()}`,
        })
      } else {
        // Hybrid flow (PIX or Credit Card)
        result = await orchestrator.processHybridPayment({
          amount: Number.parseFloat(amount),
          merchantAddress,
          paymentMethod,
        })
      }

      setPaymentResult(result)
    } catch (error) {
      console.error("[v0] Payment error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const isHybridFlow = paymentMethod === "pix" || paymentMethod === "credit_card"

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-bold text-foreground">Payment Simulation</h1>
            <p className="text-lg text-muted-foreground">Experience PAYHUB's hybrid and crypto-native payment flows</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <Label>Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                    <div className="flex items-center space-x-2 rounded-lg border border-border p-4 hover:bg-accent/50">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex flex-1 cursor-pointer items-center gap-3">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">PIX</div>
                          <div className="text-xs text-muted-foreground">Instant Brazilian payment</div>
                        </div>
                        <Badge variant="secondary" className="ml-auto">
                          Hybrid
                        </Badge>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 rounded-lg border border-border p-4 hover:bg-accent/50">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="flex flex-1 cursor-pointer items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Credit Card</div>
                          <div className="text-xs text-muted-foreground">Visa, Mastercard, Amex</div>
                        </div>
                        <Badge variant="secondary" className="ml-auto">
                          Hybrid
                        </Badge>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 rounded-lg border border-border p-4 hover:bg-accent/50">
                      <RadioGroupItem value="crypto" id="crypto" />
                      <Label htmlFor="crypto" className="flex flex-1 cursor-pointer items-center gap-3">
                        <Wallet className="h-5 w-5 text-secondary" />
                        <div>
                          <div className="font-medium">Crypto Wallet</div>
                          <div className="text-xs text-muted-foreground">Direct blockchain payment</div>
                        </div>
                        <Badge variant="secondary" className="ml-auto bg-secondary/10 text-secondary">
                          Crypto
                        </Badge>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (BRL)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100.00"
                  />
                </div>

                {/* Crypto-specific fields */}
                {paymentMethod === "crypto" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="crypto-asset">Crypto Asset</Label>
                      <Select value={cryptoAsset} onValueChange={(value: any) => setCryptoAsset(value)}>
                        <SelectTrigger id="crypto-asset">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XRP">XRP</SelectItem>
                          <SelectItem value="RLUSD">RLUSD (Stablecoin)</SelectItem>
                          <SelectItem value="USDC">USDC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customer-wallet">Your Wallet Address (Optional)</Label>
                      <Input
                        id="customer-wallet"
                        value={customerWallet}
                        onChange={(e) => setCustomerWallet(e.target.value)}
                        placeholder="rYourWalletAddress..."
                      />
                      <p className="text-xs text-muted-foreground">Leave empty to generate a test wallet</p>
                    </div>
                  </>
                )}

                {/* Merchant Address */}
                <div className="space-y-2">
                  <Label htmlFor="merchant">Merchant Address</Label>
                  <Input
                    id="merchant"
                    value={merchantAddress}
                    onChange={(e) => setMerchantAddress(e.target.value)}
                    placeholder="rMERCHANT_ADDRESS"
                  />
                </div>

                {/* Submit Button */}
                <Button className="w-full" size="lg" onClick={handlePayment} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Process Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Flow Explanation & Results */}
            <div className="space-y-6">
              {/* Flow Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    {isHybridFlow ? "Hybrid Flow" : "Crypto Flow"}
                  </CardTitle>
                  <CardDescription>
                    {isHybridFlow ? "Traditional payment converted to crypto settlement" : "Direct blockchain payment"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isHybridFlow ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          1
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You pay in BRL via {paymentMethod === "pix" ? "PIX" : "Credit Card"}
                        </p>
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
                        <p className="text-sm text-muted-foreground">Fiat converted to RLUSD stablecoin</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          4
                        </div>
                        <p className="text-sm text-muted-foreground">Merchant receives crypto via XRPL Escrow</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                          1
                        </div>
                        <p className="text-sm text-muted-foreground">Connect your Web3 wallet</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                          2
                        </div>
                        <p className="text-sm text-muted-foreground">Pay directly with {cryptoAsset}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                          3
                        </div>
                        <p className="text-sm text-muted-foreground">Transaction settled on XRPL</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                          4
                        </div>
                        <p className="text-sm text-muted-foreground">Merchant receives instant payment</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Result */}
              {paymentResult && (
                <>
                  <Card className="border-2 border-green-500/20 bg-green-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        Payment Successful
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Transaction ID:</span>
                          <span className="font-mono text-xs">{paymentResult.transactionId}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Merchant Receives:</span>
                          <span className="font-semibold">{paymentResult.merchantReceives}</span>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">PAYHUB Fee (1.5%):</span>
                            <span>R$ {paymentResult.fees.payhubFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Network Fee:</span>
                            <span>R$ {paymentResult.fees.networkFee.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Total Fees:</span>
                            <span>R$ {paymentResult.fees.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Escrow Monitor Component */}
                  {paymentResult.escrowDetails && <EscrowMonitor transaction={paymentResult.escrowDetails} />}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
