'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Landmark, Waves, Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("hybrid");

  const { data, error, status, sendTransaction } = useSendTransaction();

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  const handlePayment = () => {
    switch (paymentMethod) {
      case "crypto":
        console.log("Pagamento com cripto selecionado. Iniciando transação...");
        if (sendTransaction) {
          sendTransaction({
            to: '0x0000000000000000000000000000000000000000',
            value: parseEther('0.01'),
          });
        }
        break;
      case "hybrid":
        console.log("Pagamento híbrido selecionado.");
        break;
      case "card":
        console.log("Pagamento com cartão de crédito selecionado.");
        break;
      case "bank":
        console.log("Pagamento com transferência bancária selecionado.");
        break;
      default:
        console.log("Selecione um método de pagamento.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-start">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Finalizar Pagamento</CardTitle>
            <ConnectButton />
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex justify-between items-center border-b pb-4">
            <span className="text-muted-foreground">Produto</span>
            <span className="font-semibold">Plano Premium PAYHUB</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Valor Total</span>
            <span className="text-2xl font-bold">R$ 99,90</span>
          </div>

          <div className="grid gap-4">
            <Label className="text-base">Selecione o Método de Pagamento</Label>
            <RadioGroup
              defaultValue="hybrid"
              className="grid gap-4"
              onValueChange={setPaymentMethod}
            >
              <div>
                <RadioGroupItem value="hybrid" id="hybrid" className="peer sr-only" />
                <Label
                  htmlFor="hybrid"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center gap-4 w-full">
                    <Waves className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">Híbrido (XRPL + Fiat)</p>
                      <p className="text-sm text-muted-foreground">Pague parte com saldo digital e o restante com cartão.</p>
                    </div>
                  </div>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center gap-4 w-full">
                    <CreditCard className="h-6 w-6" />
                    <p className="font-semibold">Cartão de Crédito</p>
                  </div>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="crypto" id="crypto" className="peer sr-only" />
                <Label
                  htmlFor="crypto"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center gap-4 w-full">
                    <Wallet className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-semibold">Pagar com Cripto (Wallet Connect)</p>
                    </div>
                  </div>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                <Label
                  htmlFor="bank"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center gap-4 w-full">
                    <Landmark className="h-6 w-6" />
                    <p className="font-semibold">Transferência Bancária</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          {isLoading && <div>Check wallet...</div>}
          {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
          {error && (
            <div>Error: {error.message}</div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            onClick={handlePayment}
            disabled={isLoading || (paymentMethod === 'crypto' && !sendTransaction)}
          >
            {isLoading ? 'Enviando...' : 'Pagar Agora'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
