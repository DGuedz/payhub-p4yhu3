import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { Home } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Início
          </Link>
          <Link href="/payment" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Pagamento
          </Link>
          <Link href="/merchant" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Dashboard do Lojista
          </Link>
          <Link href="/demo" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Demonstração
          </Link>
          <Link href="/documentation" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Documentação
          </Link>
          <Link href="/xrpl-tools" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            XRPL Tools
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" asChild className="mr-1">
            <Link href="/" aria-label="Página Inicial">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/payment">Conectar Carteira</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/demo-simple">Começar</Link>
          </Button>
        </div>
        </div>
      </div>
    </header>
  )
}
