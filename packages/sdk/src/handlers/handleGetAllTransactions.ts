import { ComposeClient } from '@composedb/client'
// GET /v1/safes/{address}/multisig-transactions/
// GET /v1/safes/{address}/all-transactions/

import RouteHandler from '../types/ROUTE_HANDLER.type.js'
import { checkSafeExists } from '../composedb/queries/querySafe.js'
import { getAllTransactions } from '../composedb/queries/queryTransaction.js'
import { GetAllTransactionsPayload } from '../types/GET_ALL_TRANSACTIONS.js'

const handleGetAllTransactions: RouteHandler<GetAllTransactionsPayload> = async (
  composeClient: ComposeClient,
  payload?: GetAllTransactionsPayload,
  network?: string,
) => {
  // ensure address is not undefined
  if (payload?.address === undefined) {
    throw Error('Safe address not defined in payload')
  }
  // get safe ID
  const safeExists = await checkSafeExists(payload?.address, composeClient)
  if (!safeExists.exists) {
    throw Error("Safe doesn't exists")
  }
  const safeId = safeExists.id
  // get transactions where safe ID
  const transactionExists = await getAllTransactions(safeId, network as string, composeClient)
  console.log(transactionExists.transactionData)
  return transactionExists.exists
}

export default handleGetAllTransactions
