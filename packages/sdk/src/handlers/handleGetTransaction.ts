// GET /v1/multisig-transactions/{safe_tx_hash}/

import { type ComposeClient } from '@composedb/client'
import { type GetTransactionPayload } from '../types/GET_TRANSACTION_PAYLOAD.type.js'
import type RouteHandler from '../types/ROUTE_HANDLER.type.js'
import { getTransaction } from '../composedb/queries/queryTransaction.js'

const networkId = 'eip155:1'

const handleGetTransaction: RouteHandler<GetTransactionPayload> = async (
  composeClient: ComposeClient,
  payload?: GetTransactionPayload,
  network?: string,
) => {
  // ensure address is not undefined
  if (payload?.safeTxHash === undefined) {
    throw Error('Safe Tx Hash not defined in payload')
  }
  // get transaction based on the hash
  // note: safeTxHash is unique on all chains, i.e. safeTxHash on ETH will be unique and can never exist on other chain
  const transactionExists = await getTransaction(
    payload.safeTxHash,
    networkId as string,
    composeClient,
  )
  return { status: transactionExists.exists, data: transactionExists.id }
}

export default handleGetTransaction
