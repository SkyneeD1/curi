"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useTransactions } from "@/hooks/use-transactions"
import type { Transaction } from "@/types/transaction"
import Image from "next/image"
import Link from "next/link"

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, logout, isLoading } = useAuth()
  const { transactions } = useTransactions()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Só redirecionar após o componente estar montado e não estar carregando
    if (mounted && !isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, isAdmin, isLoading, mounted, router])

  // Mostrar loading enquanto verifica autenticação
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando painel administrativo...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, não renderizar nada (vai redirecionar)
  if (!isAuthenticated || !isAdmin) {
    return null
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getTransactionTypeLabel = (type: string) => {
    return type === "add" ? "Adição" : "Remoção"
  }

  const getTransactionTypeClass = (type: string) => {
    return type === "add" ? "text-green-600" : "text-red-600"
  }

  // Agrupar transações por projeto
  const projectTransactions: Record<string, Transaction[]> = {}
  transactions.forEach((transaction) => {
    if (!projectTransactions[transaction.projectId]) {
      projectTransactions[transaction.projectId] = []
    }
    projectTransactions[transaction.projectId].push(transaction)
  })

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image
              src="https://www.curitiba.pr.gov.br/include/design/img/logoPMC.png"
              alt="Logo Prefeitura de Curitiba"
              width={120}
              height={48}
              className="h-12 w-auto"
            />
            <h1 className="text-xl font-bold text-gray-800">Painel Administrativo</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Voltar ao Site
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resumo de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total de Apoios</p>
                <p className="text-2xl font-bold text-green-600">
                  {transactions.filter((t) => t.type === "add").length}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total de Ajustes</p>
                <p className="text-2xl font-bold text-red-600">
                  {transactions.filter((t) => t.type === "remove").length}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Valor Total Arrecadado</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    transactions.reduce((total, t) => {
                      if (t.type === "add") return total + t.amount
                      if (t.type === "remove") return total - t.amount
                      return total
                    }, 0),
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas as Transações</TabsTrigger>
            <TabsTrigger value="by-project">Por Projeto</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico Completo de Transações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Data</th>
                        <th className="text-left py-3 px-4">Projeto</th>
                        <th className="text-left py-3 px-4">Tipo</th>
                        <th className="text-left py-3 px-4">Valor</th>
                        <th className="text-left py-3 px-4">Apoiador/Motivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-gray-500">
                            Nenhuma transação registrada
                          </td>
                        </tr>
                      ) : (
                        transactions
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((transaction) => (
                            <tr key={transaction.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">{formatDate(transaction.date)}</td>
                              <td className="py-3 px-4">{transaction.projectId}</td>
                              <td className={`py-3 px-4 ${getTransactionTypeClass(transaction.type)}`}>
                                {getTransactionTypeLabel(transaction.type)}
                              </td>
                              <td className={`py-3 px-4 ${getTransactionTypeClass(transaction.type)}`}>
                                {formatCurrency(transaction.amount)}
                              </td>
                              <td className="py-3 px-4">
                                {transaction.type === "add"
                                  ? `${transaction.supporter} (${transaction.governmentSphere} - ${transaction.department})`
                                  : transaction.reason}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="by-project" className="space-y-4">
            {Object.keys(projectTransactions).length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  Nenhuma transação registrada para projetos
                </CardContent>
              </Card>
            ) : (
              Object.entries(projectTransactions).map(([projectId, projectTxns]) => (
                <Card key={projectId} className="mb-6">
                  <CardHeader>
                    <CardTitle>Projeto: {projectId}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Data</th>
                            <th className="text-left py-3 px-4">Tipo</th>
                            <th className="text-left py-3 px-4">Valor</th>
                            <th className="text-left py-3 px-4">Apoiador/Motivo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectTxns
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((transaction) => (
                              <tr key={transaction.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{formatDate(transaction.date)}</td>
                                <td className={`py-3 px-4 ${getTransactionTypeClass(transaction.type)}`}>
                                  {getTransactionTypeLabel(transaction.type)}
                                </td>
                                <td className={`py-3 px-4 ${getTransactionTypeClass(transaction.type)}`}>
                                  {formatCurrency(transaction.amount)}
                                </td>
                                <td className="py-3 px-4">
                                  {transaction.type === "add"
                                    ? `${transaction.supporter} (${transaction.governmentSphere} - ${transaction.department})`
                                    : transaction.reason}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
