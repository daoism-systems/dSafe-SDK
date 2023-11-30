export interface CreateTransactionPayload {
  safe: string
  sender: string
  contractTransactionHash: string
  to: string
  baseGas: number
  gasPrice: string
  safeTxGas: number
  value: string
  refundReceiver?: string
  data?: string
  operation: number
  gasToken?: string
  nonce: number
  origin?: string
  signature: string
}
