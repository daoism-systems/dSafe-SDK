import { type ComposeClient } from '@composedb/client'

type CreateSignerSafeInput = Record<string, any>

const COMPOSE_SIGNER_SAFE = () => `
mutation CreateSignerSafeRelationship($input: CreateSignerSafeRelationshipInput!) {
    createSignerSafeRelationship(input: $input) {
      document {
        blockWhenAdded
        network
        safeID
        signerID
        id
      }
    }
  }
  `

export async function composeSignerSafe(
  input: CreateSignerSafeInput,
  composeClient: ComposeClient,
): Promise<void> {
  const executionResult = await composeClient.executeQuery(COMPOSE_SIGNER_SAFE(), { input })
  console.log(executionResult)
}
