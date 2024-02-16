import { type ComposeClient } from '@composedb/client'
import { type MarkTransactionExecutedPayload } from '../types/MARK_TRANSACTION_EXECUTED.type.js'
import type RouteHandler from '../types/ROUTE_HANDLER.type.js'
import { updateTransaction } from '../composedb/mutations/mutateTransaction.js'
import { getTransaction } from '../composedb/queries/queryTransaction.js'
import { CAIP } from '../config/networks.js'

const handleMarkTransactionExecuted: RouteHandler<MarkTransactionExecutedPayload> = async (
  composeClient: ComposeClient,
  payload?: MarkTransactionExecutedPayload,
  network?: string,
) => {
  if (payload?.safeTxHash === undefined) {
    throw Error('Safe Transaction Hash not provided')
  }
  const networkId = network ? CAIP[network] : ''

  const getTransactionResponse = await getTransaction(payload.safeTxHash, networkId, composeClient)

  if (getTransactionResponse.exists) {
    const transactionId = getTransactionResponse.data?.id
    console.log({ transactionId })

    const input = {
      id: transactionId,
      content: {
        executor: payload.executor,
        trxHash: payload.txHash,
      },
    }

    const updateTransactionExecutionResponse = await updateTransaction(input, composeClient)
    return {
      status: updateTransactionExecutionResponse.status,
      data: updateTransactionExecutionResponse.data,
    }
  }
  return { status: false, data: { error: 'Transaction Not Found' } }
}

export default handleMarkTransactionExecuted
