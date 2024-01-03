import { type ComposeClient } from '@composedb/client'

type CreateTransactionInput = Record<string, any>

const COMPOSE_TRANSACTION = (): string => `
mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      document {
        safeTransactionHash
        to
        baseGas
        gasPrice
        safeTxGas
        value
        refundReceiver
        data
        operation
        gasToken
        nonce
        sender
        signature
        safeID
        network
        id
      }
    }
  }
  `

export async function composeTransaction(
  input: CreateTransactionInput,
  composeClient: ComposeClient,
): Promise<void> {
  const executionResult = await composeClient.executeQuery(COMPOSE_TRANSACTION(), { input })
  console.log(executionResult)
}
