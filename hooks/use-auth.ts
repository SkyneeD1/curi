"use client"

import { useState, useEffect } from "react"
import type { AuthState, AdminCredentials } from "@/types/auth"

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "200817"

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isAdmin: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se já existe uma sessão ativa
    try {
      const storedAuth = localStorage.getItem("auth-state")
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth)
        setAuthState(parsedAuth)
      }
    } catch (error) {
      console.error("Erro ao carregar estado de autenticação:", error)
      // Limpar dados corrompidos
      localStorage.removeItem("auth-state")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (credentials: AdminCredentials): boolean => {
    if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
      const newAuthState = {
        isAuthenticated: true,
        isAdmin: true,
      }
      setAuthState(newAuthState)
      localStorage.setItem("auth-state", JSON.stringify(newAuthState))
      return true
    }
    return false
  }

  const logout = () => {
    const newAuthState = {
      isAuthenticated: false,
      isAdmin: false,
    }
    setAuthState(newAuthState)
    localStorage.removeItem("auth-state")
  }

  return {
    ...authState,
    isLoading,
    login,
    logout,
  }
}
