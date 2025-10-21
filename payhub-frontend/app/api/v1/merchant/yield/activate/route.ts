import { NextRequest, NextResponse } from "next/server"

// Simplified activation endpoint for Auto-Yield service
// Applies a basic allocation policy and returns expected yield metrics

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))

    const merchantId = body?.merchantId ?? "merchant_demo"
    const rlusdBalance = Number(body?.rlusdBalance ?? 10000) // Default demo balance
    const segment: "micro" | "mid" | "enterprise" = body?.segment ?? "micro"
    const targetAPY = Number(body?.targetAPY ?? 0.065) // 6.5% APY

    // Allocation policy by segment (hot wallet vs yield pool)
    const policies = {
      micro: { hotWalletPct: 0.2, yieldPct: 0.8 },
      mid: { hotWalletPct: 0.3, yieldPct: 0.7 },
      enterprise: { hotWalletPct: 0.4, yieldPct: 0.6 },
    } as const

    const policy = policies[segment] ?? policies.micro

    const hotWalletAmount = rlusdBalance * policy.hotWalletPct
    const yieldAmount = rlusdBalance * policy.yieldPct

    // Simple monthly estimate (not compounding), APY annualized
    const estimatedMonthlyReturn = (yieldAmount * targetAPY) / 12

    const response = {
      activated: true,
      merchantId,
      segment,
      targetAPY,
      allocationPolicy: {
        hotWalletPct: policy.hotWalletPct,
        yieldPct: policy.yieldPct,
        hotWalletAmount: Number(hotWalletAmount.toFixed(2)),
        yieldAmount: Number(yieldAmount.toFixed(2)),
      },
      metrics: {
        rlusdBalance: Number(rlusdBalance.toFixed(2)),
        estimatedMonthlyReturn: Number(estimatedMonthlyReturn.toFixed(2)),
        estimatedDailyReturn: Number((yieldAmount * targetAPY / 365).toFixed(2)),
      },
      routes: {
        convertRLUSDToMXRP: {
          enabled: true,
          network: "XRPL EVM Sidechain",
          asset: "mXRP",
        },
        staking: {
          strategy: "liquid_staking",
          provider: "demo_protocol",
        },
      },
      message: "Auto-Yield ativado com sucesso. Alocação aplicada ao excedente de caixa.",
      timestamp: Date.now(),
    }

    return NextResponse.json(response, { status: 200 })
  } catch (err) {
    console.error("[HUB AI] Yield activation error:", err)
    return NextResponse.json({
      activated: false,
      error: "Falha ao ativar Auto-Yield",
    }, { status: 500 })
  }
}