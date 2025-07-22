export interface Transaction {
  id: string
  projectId: string
  date: string
  type: "add" | "remove"
  amount: number
  supporter?: string
  governmentSphere?: string
  department?: string
  reason?: string
}
