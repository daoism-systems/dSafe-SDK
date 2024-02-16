// GET /v1/multisig-transactions/{safe_tx_hash}/

import { type ComposeClient } from '@composedb/client'
import { type GetTransactionPayload } from '../types/GET_TRANSACTION_PAYLOAD.type.js'
import type RouteHandler from '../types/ROUTE_HANDLER.type.js'
import { getTransaction } from '../composedb/queries/queryTransaction.js'
import { CAIP } from '../config/networks.js'

const handleGetTransaction: RouteHandler<GetTransactionPayload> = async (
  composeClient: ComposeClient,
  payload?: GetTransactionPayload,
  network?: string,
) => {
  const networkId = network ? CAIP[network] : ''
  // ensure address is not undefined
  if (payload?.safeTxHash === undefined) {
    throw Error('Safe Tx Hash not defined in payload')
  }
  // get transaction based on the hash
  // note: safeTxHash is unique on all chains, i.e. safeTxHash on ETH will be unique and can never exist on other chain
  const transactionExists = await getTransaction(payload.safeTxHash, networkId, composeClient)
  return { status: transactionExists.exists, data: transactionExists.data }
}

export default handleGetTransaction
