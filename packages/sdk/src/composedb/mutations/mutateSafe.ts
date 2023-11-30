import { type ComposeClient } from '@composedb/client'

type CreateSafeInput = Record<string, any>

const COMPOSE_SAFE = () => `
mutation CreateSafe($input: CreateSafeInput!) {
    createSafe(input: $input) {
      document {
        safeAddress
        network
        nonce
        fallbackHandler
        guard
        version
        totalTransactions
        singleton
        deployedBlockNumber
        nativeTokenBalance
        threshold
      }
    }
  }`

export async function composeSafe(
  input: CreateSafeInput,
  composeClient: ComposeClient,
): Promise<void> {
  const executionResult = await composeClient.executeQuery(COMPOSE_SAFE(), { input })
  console.log(executionResult)
}
