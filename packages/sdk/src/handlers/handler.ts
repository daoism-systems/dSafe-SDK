import { type ComposeClient } from '@composedb/client'
import Logger from '../utils/Logger.utils.js'
import { type CreateTransactionPayload } from '../types/CREATE_TRANSACTION_PAYLOAD.type.js'
import handleCreateTransaction from './handleCreateTransaction.js'
import handleDataDecoder from './handleDataDecoder.js'
import RouteHandler from '../types/ROUTE_HANDLER.type.js'
import handleUpdateConfirmations from './handleUpdateConfirmations.js'

const log = new Logger()

export function handleDSafeLog(apiRoute: string): void {
  log.info('Using DSafe Registry and then SafeTransaction API. API Route:', [apiRoute])
}

// Structure to map regex patterns to handlers
// Note: TypeScript does not support regex as object keys directly, hence using strings
// keep adding new handlers here to handle more API routes
const routeHandlers: Record<string, RouteHandler<any>> = {
  '^v1/data-decoder/$': handleDataDecoder,
  '^v1/safes/([a-fA-F0-9]+)/multisig-transactions/$': handleCreateTransaction,
  '^/v1/multisig-transactions/[a-fA-F0-9]+/confirmations/$': handleUpdateConfirmations,
}

export default async function handleDSafeRequest(
  composeClient: ComposeClient,
  httpMethod: 'POST' | 'GET' | 'DELETE',
  apiRoute: string,
  payload?: unknown,
  network?: string,
): Promise<boolean> {
  console.log('Handling:', apiRoute)
  for (const pattern in routeHandlers) {
    if (new RegExp(pattern).test(apiRoute)) {
      console.log(`Implementing route: ${apiRoute}`)
      await routeHandlers[pattern](composeClient, payload, network)
      return true
    }
  }
  console.log(`No handler found for route: ${apiRoute}`)
  return false
}
