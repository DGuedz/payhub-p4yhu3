"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpRight, CreditCard, DollarSign, Users, Waves } from "lucide-react"

export function MerchantDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 245.231,89</div>
            <p className="text-xs text-muted-foreground">+20.1% desde o último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-muted-foreground">+180.1% desde o último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1.234</div>
            <p className="text-xs text-muted-foreground">+19% desde o último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações Híbridas</CardTitle>
            <Waves className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 desde a última hora</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Ana Silva</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">ana.silva@example.com</div>
                  </TableCell>
                  <TableCell>Híbrido</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="outline">
                      Aprovado
                    </Badge>
                  </TableCell>
                  <TableCell>2024-07-28</TableCell>
                  <TableCell className="text-right">R$ 250,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Bruno Costa</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">bruno.costa@example.com</div>
                  </TableCell>
                  <TableCell>Estorno</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="destructive">
                      Cancelado
                    </Badge>
                  </TableCell>
                  <TableCell>2024-07-27</TableCell>
                  <TableCell className="text-right">R$ 150,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Carlos Pereira</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">carlos.pereira@example.com</div>
                  </TableCell>
                  <TableCell>Assinatura</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="outline">
                      Ativa
                    </Badge>
                  </TableCell>
                  <TableCell>2024-07-26</TableCell>
                  <TableCell className="text-right">R$ 99,90</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Daniela Martins</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">daniela.martins@example.com</div>
                  </TableCell>
                  <TableCell>Venda</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="outline">
                      Aprovado
                    </Badge>
                  </TableCell>
                  <TableCell>2024-07-25</TableCell>
                  <TableCell className="text-right">R$ 450,00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Clientes Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Olivia Martins</p>
                  <p className="text-sm text-muted-foreground">olivia.martins@email.com</p>
                </div>
                <div className="ml-auto font-medium">+R$ 1.999,00</div>
              </div>
              <div className="flex items-center">
                <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">João Lima</p>
                  <p className="text-sm text-muted-foreground">joao.lima@email.com</p>
                </div>
                <div className="ml-auto font-medium">+R$ 39,00</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Isabella Novaes</p>
                  <p className="text-sm text-muted-foreground">isabella.novaes@email.com</p>
                </div>
                <div className="ml-auto font-medium">+R$ 299,00</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>WS</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">William Santos</p>
                  <p className="text-sm text-muted-foreground">will.santos@email.com</p>
                </div>
                <div className="ml-auto font-medium">+R$ 99,00</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Sofia Dias</p>
                  <p className="text-sm text-muted-foreground">sofia.dias@email.com</p>
                </div>
                <div className="ml-auto font-medium">+R$ 39,00</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}