import { type ComposeClient } from '@composedb/client'

type CreateTransactionInput = Record<string, any>

type UpdateExecutorInput = Record<string, any>

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

const UPDATE_TRANSACTION = (): string => `
mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
      document {
        trxHash
        executor
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

export async function updateTransaction(
  input: UpdateExecutorInput,
  composeClient: ComposeClient,
): Promise<{ status: boolean; data: any }> {
  try {
    const executionResult = await composeClient.executeQuery(UPDATE_TRANSACTION(), { input })

    console.log({
      updateTransactionExecutionResult: { executionResult },
    })

    return { status: true, data: executionResult.data }
  } catch (err) {
    console.log({ err })
    return { status: false, data: { error: err } }
  }
}
