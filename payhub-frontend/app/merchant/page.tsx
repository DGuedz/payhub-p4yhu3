"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getPaymentOrchestrator } from "@/lib/payment-orchestrator"
import type { PaymentTransaction } from "@/lib/xrpl-client"
import {
  TrendingUp,
  DollarSign,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
  Filter,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MerchantDashboard() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadTransactions = () => {
    setIsLoading(true)
    const orchestrator = getPaymentOrchestrator()
    const txHistory = orchestrator.getTransactionHistory()
    setTransactions(txHistory)
    setIsLoading(false)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  // Calculate statistics
  const totalTransactions = transactions.length
  const completedTransactions = transactions.filter((tx) => tx.status === "completed").length
  const pendingTransactions = transactions.filter((tx) => tx.status === "pending").length
  const totalVolume = transactions
    .filter((tx) => tx.status === "completed")
    .reduce((sum, tx) => sum + Number.parseFloat(tx.amount), 0)

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-500/10 text-green-600">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="secondary" className="bg-red-500/10 text-red-600">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-foreground">Merchant Dashboard</h1>
            <p className="text-lg text-muted-foreground">Monitor your PAYHUB transactions and analytics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={loadTransactions} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalVolume.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">RLUSD equivalent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedTransactions}</div>
              <p className="text-xs text-muted-foreground">
                {totalTransactions > 0 ? ((completedTransactions / totalTransactions) * 100).toFixed(1) : 0}% success
                rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingTransactions}</div>
              <p className="text-xs text-muted-foreground">Awaiting settlement</p>
            </CardContent>
          </Card>
        </div>

        {/* Merchant Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Merchant Information</CardTitle>
            <CardDescription>Your XRPL receiving address and settlement details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">XRPL Address</p>
                <p className="font-mono text-sm">rMERCHANT_DEMO_ADDRESS</p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border p-4">
                <p className="mb-1 text-sm text-muted-foreground">Settlement Currency</p>
                <p className="font-semibold">RLUSD</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="mb-1 text-sm text-muted-foreground">Escrow Duration</p>
                <p className="font-semibold">5 minutes</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="mb-1 text-sm text-muted-foreground">PAYHUB Fee</p>
                <p className="font-semibold">1.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Recent payments received via PAYHUB</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Activity className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 text-lg font-semibold">No transactions yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">Process a payment to see transactions appear here</p>
                <Button asChild>
                  <a href="/payment">Make Test Payment</a>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Escrow</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-xs">{tx.id.substring(0, 16)}...</TableCell>
                        <TableCell className="font-mono text-xs">{tx.from.substring(0, 12)}...</TableCell>
                        <TableCell className="font-semibold">{tx.amount}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{tx.currency}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(tx.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(tx.timestamp)}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {tx.escrowSequence ? `#${tx.escrowSequence}` : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Summary */}
        {transactions.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Transaction Value</span>
                  <span className="font-semibold">
                    R$ {totalTransactions > 0 ? (totalVolume / totalTransactions).toFixed(2) : "0.00"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Latest Transaction</span>
                  <span className="text-sm">{formatDate(transactions[transactions.length - 1].timestamp)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Settlement Method</span>
                  <Badge variant="secondary">XRPL Escrow</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
