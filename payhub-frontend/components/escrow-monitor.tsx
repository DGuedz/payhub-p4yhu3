"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import type { PaymentTransaction } from "@/lib/xrpl-client"

interface EscrowMonitorProps {
  transaction: PaymentTransaction
  onComplete?: () => void
}

export function EscrowMonitor({ transaction, onComplete }: EscrowMonitorProps) {
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (transaction.status === "completed") {
      setProgress(100)
      return
    }

    const startTime = transaction.timestamp
    const duration = 300000 // 5 minutes in milliseconds
    const endTime = startTime + duration

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = now - startTime
      const remaining = Math.max(0, endTime - now)

      setTimeRemaining(Math.floor(remaining / 1000))
      setProgress(Math.min(100, (elapsed / duration) * 100))

      if (remaining <= 0 && transaction.status === "pending") {
        clearInterval(interval)
        onComplete?.()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [transaction, onComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>XRPL Escrow Status</CardTitle>
          </div>
          {transaction.status === "pending" ? (
            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
              <Clock className="mr-1 h-3 w-3" />
              Active
            </Badge>
          ) : transaction.status === "completed" ? (
            <Badge variant="secondary" className="bg-green-500/10 text-green-600">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Released
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-red-500/10 text-red-600">
              <AlertCircle className="mr-1 h-3 w-3" />
              Failed
            </Badge>
          )}
        </div>
        <CardDescription>Trustless payment settlement via XRPL Escrow</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Escrow Details */}
        <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Escrow Sequence:</span>
            <span className="font-mono">#{transaction.escrowSequence}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount Locked:</span>
            <span className="font-semibold">
              {transaction.amount} {transaction.currency}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">From:</span>
            <span className="font-mono text-xs">{transaction.from.substring(0, 20)}...</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">To:</span>
            <span className="font-mono text-xs">{transaction.to.substring(0, 20)}...</span>
          </div>
        </div>

        {/* Progress Bar */}
        {transaction.status === "pending" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Time until auto-release:</span>
              <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Escrow will automatically release funds to merchant after the time period expires
            </p>
          </div>
        )}

        {transaction.status === "completed" && (
          <div className="rounded-lg bg-green-500/10 p-4 text-center">
            <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-600" />
            <p className="font-semibold text-green-600">Escrow Released Successfully</p>
            <p className="text-xs text-muted-foreground">Funds have been transferred to the merchant</p>
          </div>
        )}

        {/* Escrow Info */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Shield className="h-4 w-4" />
            How XRPL Escrow Works
          </h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Funds are locked on the XRPL blockchain</li>
            <li>• Neither party can access funds during escrow period</li>
            <li>• Automatic release after time condition is met</li>
            <li>• Trustless settlement without intermediaries</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
