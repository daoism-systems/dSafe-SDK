// GET /v1/multisig-transactions/{safe_tx_hash}/confirmations/
// GET /v1/multisig-transactions/{safe_tx_hash}/

import { type ComposeClient } from '@composedb/client'
import { type GetTransactionConfirmationsPayload } from '../types/GET_TRANSACTION_CONFIRMATIONS_PAYLOAD.type.js'
import type RouteHandler from '../types/ROUTE_HANDLER.type.js'
import { getTransactionConfirmations } from '../composedb/queries/queryConfirmation.js'
import { CAIP } from '../config/networks.js'

const handleGetTransactionConfirmations: RouteHandler<GetTransactionConfirmationsPayload> = async (
  composeClient: ComposeClient,
  payload?: GetTransactionConfirmationsPayload,
  network?: string,
) => {
  const networkId = network ? CAIP[network] : ''
  // ensure address is not undefined
  if (payload?.safeTxHash === undefined) {
    throw Error('Safe Tx Hash not defined in payload')
  }
  // get transaction based on the hash
  // note: safeTxHash is unique on all chains, i.e. safeTxHash on ETH will be unique and can never exist on other chain
  const transactionExists = await getTransactionConfirmations(
    payload.safeTxHash,
    networkId,
    composeClient,
  )
  console.log({ transactionExists })
  return {
    status: transactionExists.exists,
    data: transactionExists.confirmationData.confirmations.edges.map((edge: any) => edge.node),
  }
}

export default handleGetTransactionConfirmations
