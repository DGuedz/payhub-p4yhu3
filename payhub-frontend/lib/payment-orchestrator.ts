import { getXRPLClient, type PaymentTransaction } from "./xrpl-client"

export interface PaymentRequest {
  amount: number // Amount in BRL
  merchantAddress: string
  paymentMethod: "pix" | "credit_card" | "crypto"
  cryptoAsset?: "XRP" | "RLUSD" | "USDC"
  customerWallet?: string
}

export interface PaymentResult {
  success: boolean
  transactionId: string
  merchantReceives: string
  fees: {
    payhubFee: number
    networkFee: number
    total: number
  }
  escrowDetails?: PaymentTransaction
}

export class PaymentOrchestrator {
  private xrplClient = getXRPLClient()
  private readonly PAYHUB_FEE_PERCENT = 0.015 // 1.5%
  private readonly NETWORK_FEE_XRP = 0.00001 // 0.00001 XRP
  private readonly BRL_TO_RLUSD_RATE = 1.0 // Simplified 1:1 for demo

  async processHybridPayment(request: PaymentRequest): Promise<PaymentResult> {

    // Step 1: Calculate fees
    const payhubFee = request.amount * this.PAYHUB_FEE_PERCENT
    const networkFee = this.NETWORK_FEE_XRP * 5.5 // Convert to BRL equivalent
    const totalFees = payhubFee + networkFee
    const merchantReceivesAmount = request.amount - totalFees

    // Step 2: Create ephemeral wallet for customer
    const ephemeralWallet = await this.xrplClient.createEphemeralWallet()

    // Step 3: Establish trustline for RLUSD
    await this.xrplClient.establishTrustline(ephemeralWallet.address, "rISSUER_TESTNET_ADDRESS", "RLUSD", "1000000")

    // Step 4: Issue RLUSD to ephemeral wallet (simulating fiat conversion)
    const rlusdAmount = (request.amount * this.BRL_TO_RLUSD_RATE).toFixed(2)
    await this.xrplClient.issueRLUSD(ephemeralWallet.address, rlusdAmount)

    // Step 5: Create escrow to merchant
    const escrow = await this.xrplClient.createEscrow(
      ephemeralWallet.address,
      request.merchantAddress,
      merchantReceivesAmount.toFixed(2),
      "RLUSD",
    )

    // Step 6: Auto-finish escrow (in real scenario, this would be conditional)
    setTimeout(async () => {
      await this.xrplClient.finishEscrow(escrow.id)
    }, 3000)

    return {
      success: true,
      transactionId: escrow.id,
      merchantReceives: `${merchantReceivesAmount.toFixed(2)} RLUSD`,
      fees: {
        payhubFee,
        networkFee,
        total: totalFees,
      },
      escrowDetails: escrow,
    }
  }

  async processCryptoPayment(request: PaymentRequest): Promise<PaymentResult> {

    if (!request.customerWallet || !request.cryptoAsset) {
      throw new Error("Customer wallet and crypto asset required for crypto payment")
    }

    // Calculate fees
    const payhubFee = request.amount * this.PAYHUB_FEE_PERCENT
    const networkFee = this.NETWORK_FEE_XRP * 5.5
    const totalFees = payhubFee + networkFee
    const merchantReceivesAmount = request.amount - totalFees

    // Create escrow directly from customer wallet
    const escrow = await this.xrplClient.createEscrow(
      request.customerWallet,
      request.merchantAddress,
      merchantReceivesAmount.toFixed(2),
      request.cryptoAsset,
    )

    // Auto-finish escrow
    setTimeout(async () => {
      await this.xrplClient.finishEscrow(escrow.id)
    }, 3000)

    return {
      success: true,
      transactionId: escrow.id,
      merchantReceives: `${merchantReceivesAmount.toFixed(2)} ${request.cryptoAsset}`,
      fees: {
        payhubFee,
        networkFee,
        total: totalFees,
      },
      escrowDetails: escrow,
    }
  }

  getTransactionHistory(): PaymentTransaction[] {
    return this.xrplClient.getTransactions()
  }
}

// Singleton instance
let orchestrator: PaymentOrchestrator | null = null

export function getPaymentOrchestrator(): PaymentOrchestrator {
  if (!orchestrator) {
    orchestrator = new PaymentOrchestrator()
  }
  return orchestrator
}
