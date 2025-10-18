import { Header } from "@/components/header"
import { MerchantDashboard } from "@/components/merchant-dashboard"

export default function MerchantPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <MerchantDashboard />
      </main>
    </div>
  )
}
