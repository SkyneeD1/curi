"use client"

import { useState, useEffect } from "react"
import type { Transaction } from "@/types/transaction"

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Carregar transações do localStorage
    const storedTransactions = localStorage.getItem("project-transactions")
    if (storedTransactions) {
      try {
        const parsedTransactions = JSON.parse(storedTransactions)
        setTransactions(parsedTransactions)
      } catch (error) {
        console.error("Erro ao carregar transações:", error)
      }
    }
  }, [])

  const addTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString(),
    }

    const updatedTransactions = [...transactions, newTransaction]
    setTransactions(updatedTransactions)
    localStorage.setItem("project-transactions", JSON.stringify(updatedTransactions))

    return newTransaction
  }

  const getProjectTransactions = (projectId: string) => {
    return transactions.filter((t) => t.projectId === projectId)
  }

  return {
    transactions,
    addTransaction,
    getProjectTransactions,
  }
}
