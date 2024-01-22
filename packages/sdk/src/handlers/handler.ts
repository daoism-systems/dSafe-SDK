import { type ComposeClient } from '@composedb/client'
import Logger from '../utils/Logger.utils.js'
import handleCreateTransaction from './handleCreateTransaction.js'
import handleDataDecoder from './handleDataDecoder.js'
import type RouteHandler from '../types/ROUTE_HANDLER.type.js'
import handleUpdateConfirmations from './handleUpdateConfirmations.js'
import handleGetSafe from './handleGetSafe.js'
import handleGetAllTransactions from './handleGetAllTransactions.js'
import handleGetTransaction from './handleGetTransaction.js'
import handleGetTransactionConfirmations from './handleGetConfirmations.js'
import handleUpdateDelegates from './handleUpdateDelegates.js'
import handleGetDelegates from './handleGetDelegates.js'

const log = new Logger()

export function handleDSafeLog(apiRoute: string): void {
  log.info('Using DSafe Registry and then SafeTransaction API. API Route:', [apiRoute])
}

// Structure to map regex patterns to handlers
// Note: TypeScript does not support regex as object keys directly, hence using strings
// keep adding new handlers here to handle more API routes
const routeHandlers: Record<string, RouteHandler<any>> = {
  '^GET /v1/data-decoder/$': handleDataDecoder,
  '^POST /v1/safes/0x[a-fA-F0-9]+/multisig-transactions/$': handleCreateTransaction,
  '^POST /v1/multisig-transactions/0x[a-fA-F0-9]+/confirmations/$': handleUpdateConfirmations,
  '^GET /v1/safes/0x[a-fA-F0-9]+/$': handleGetSafe,
  '^GET /v1/safes/0x[a-fA-F0-9]+/multisig-transactions/$': handleGetAllTransactions,
  '^GET /v1/multisig-transactions/0x[a-fA-F0-9]+/$': handleGetTransaction,
  '^GET /v1/multisig-transactions/0x[a-fA-F0-9]+/confirmations/$':
    handleGetTransactionConfirmations,
  '^POST /v1/delegates/$': handleUpdateDelegates,
  '^GET /v1/delegates/?safe=0x[a-fA-F0-9]+$': handleGetDelegates,
}

export interface DSafeResponse {
  status: boolean
  data: any
}

export default async function handleDSafeRequest(
  composeClient: ComposeClient,
  httpMethod: 'POST' | 'GET' | 'DELETE',
  apiRoute: string,
  payload?: unknown,
  network?: string,
): Promise<any> {
  console.log('Handling:', httpMethod, apiRoute)
  const apiRouteWithRequestType = `${httpMethod} ${apiRoute}`
  for (const pattern in routeHandlers) {
    if (new RegExp(pattern).test(apiRouteWithRequestType)) {
      console.log(`Implementing route: ${apiRouteWithRequestType}`)
      const response = await routeHandlers[pattern](composeClient, payload, network)
      return response
    }
  }
  console.log(`No handler found for route: ${apiRouteWithRequestType}`)
  return { status: false, data: null }
}
