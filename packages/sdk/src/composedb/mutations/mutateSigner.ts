import { type ComposeClient } from '@composedb/client'

type CreateSignerInput = Record<string, any>

const COMPOSE_SIGNER = (): string => `
mutation CreateSigner($input: CreateSignerInput!) {
    createSigner(input: $input) {
        document {
            signer
            id
          }
    }
  }`

export async function composeSigner(
  input: CreateSignerInput,
  composeClient: ComposeClient,
): Promise<void> {
  const executionResult = await composeClient.executeQuery(COMPOSE_SIGNER(), { input })
  console.log(executionResult)
}
