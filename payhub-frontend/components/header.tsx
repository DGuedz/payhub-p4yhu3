import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="font-mono text-lg font-bold text-primary-foreground">P4Y</span>
          </div>
          <span className="text-xl font-bold text-foreground">PAYHUB</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Payment
          </Link>
          <Link href="/merchant" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Merchant Dashboard
          </Link>
          <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Documentation
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Connect Wallet
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  )
}
