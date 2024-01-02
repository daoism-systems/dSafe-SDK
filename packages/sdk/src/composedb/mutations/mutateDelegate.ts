import { ComposeClient } from '@composedb/client'

type CreateDelegateInput = Record<string, any>

const COMPOSE_DELEGATE = () => `
mutation ComposeDelegate ($input: CreateDelegateInput!) {
    createDelegate(
      input: $input
    ) {
      document {
        delegate
        delegatorID
        id
        network
        safeID
        delegator {
          signer
        }
        safe {
          safeAddress
        }
      }
    }
  }`

export async function composeDelegate(
  input: CreateDelegateInput,
  composeClient: ComposeClient,
): Promise<void> {
  const executionResult = await composeClient.executeQuery(COMPOSE_DELEGATE(), { input })
  console.log(executionResult)
}
