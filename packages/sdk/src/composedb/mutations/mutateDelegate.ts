import { type ComposeClient } from '@composedb/client'
import { STATUS_CODE_202, STATUS_CODE_400 } from '../../config/constants.js'

type CreateDelegateInput = Record<string, any>

const COMPOSE_DELEGATE = (): string => `
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
): Promise<number> {
  try {
    const executionResult = await composeClient.executeQuery(COMPOSE_DELEGATE(), { input })
    console.log({ executionResult })
    return STATUS_CODE_202
  } catch (err) {
    console.error({ err })
    return STATUS_CODE_400
  }
}
