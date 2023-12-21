// GET /v1/multisig-transactions/{safe_tx_hash}/confirmations/
// GET /v1/multisig-transactions/{safe_tx_hash}/

import { ComposeClient } from '@composedb/client'
import { GetTransactionConfirmationsPayload } from '../types/GET_TRANSACTION_CONFIRMATIONS_PAYLOAD.type.js'
import RouteHandler from '../types/ROUTE_HANDLER.type.js'
import { getTransactionConfirmations } from '../composedb/queries/queryConfirmation.js'

const networkId = 'eip155:1'

const handleGetTransactionConfirmations: RouteHandler<GetTransactionConfirmationsPayload> = async (
  composeClient: ComposeClient,
  payload?: GetTransactionConfirmationsPayload,
  network?: string,
) => {
  // ensure address is not undefined
  if (payload?.safeTxHash === undefined) {
    throw Error('Safe Tx Hash not defined in payload')
  }
  // get transaction based on the hash
  // note: safeTxHash is unique on all chains, i.e. safeTxHash on ETH will be unique and can never exist on other chain
  const transactionExists = await getTransactionConfirmations(
    payload.safeTxHash,
    networkId as string,
    composeClient,
  )
  console.log(transactionExists)
  return transactionExists.exists
}

export default handleGetTransactionConfirmations
