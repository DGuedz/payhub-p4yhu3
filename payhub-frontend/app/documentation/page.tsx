import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, FileText, Terminal, GitBranch } from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Documentação da API PAYHUB
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Integre pagamentos híbridos de forma simples e segura com nossa API robusta.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Card: Autenticação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-6 w-6 text-primary" />
              Autenticação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Para começar, obtenha sua chave de API no Merchant Dashboard. A autenticação é feita via Bearer Token no header das requisições.
            </p>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
              <code>
                {`Authorization: Bearer <SUA_CHAVE_DE_API>`}
              </code>
            </pre>
          </CardContent>
        </Card>

        {/* Card: Criar Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              Criar uma Cobrança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Crie uma nova cobrança (híbrida ou tradicional) enviando uma requisição POST para o endpoint abaixo.
            </p>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
              <code>
                {`POST /api/v1/payments`}
              </code>
            </pre>
            <p className="text-muted-foreground mt-4">
              O corpo da requisição deve conter o valor, a moeda e o método de pagamento desejado.
            </p>
          </CardContent>
        </Card>

        {/* Card: Consultar Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-6 w-6 text-primary" />
              Consultar Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Consulte o status de uma transação a qualquer momento usando o ID do pagamento.
            </p>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
              <code>
                {`GET /api/v1/payments/{paymentId}`}
              </code>
            </pre>
          </CardContent>
        </Card>

        {/* Card: Webhooks */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Webhooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Seja notificado em tempo real sobre mudanças no status das transações. Configure seus endpoints de webhook no Merchant Dashboard para receber eventos como `payment.confirmed`, `payment.failed`, etc.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-16">
        <p className="text-muted-foreground">
          Para mais detalhes, exemplos de código e SDKs, acesse nosso portal completo de desenvolvedores.
        </p>
        <a
          href="/documentation"
          className="mt-4 inline-block text-primary hover:underline"
        >
          Acessar Portal do Desenvolvedor
        </a>
      </div>
    </div>
  );
}