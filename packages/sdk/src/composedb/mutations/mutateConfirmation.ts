import { type ComposeClient } from '@composedb/client'

type CreateConfirmationInput = Record<string, any>

const COMPOSE_CONFIRMATION = () => `
mutation CreateConfirmation($input: CreateConfirmationInput!) {
    createConfirmation(input: $input) {
      document {
        signerID
        transactionId
        signature
      }
    }
  }
`

export async function composeConfirmation(
  input: CreateConfirmationInput,
  composeClient: ComposeClient,
): Promise<void> {
  const executionResult = await composeClient.executeQuery(COMPOSE_CONFIRMATION(), { input })
  console.log(executionResult)
}
