import { type ComposeClient } from '@composedb/client'
import Logger from '../utils/Logger.utils.js'
import { type CreateTransactionPayload } from '../types/CREATE_TRANSACTION_PAYLOAD.type.js'
import handleCreateTransaction from './handleCreateTransaction.js'
import handleDataDecoder from './handleDataDecoder.js'

const log = new Logger()

export function handleDSafeLog(apiRoute: string): void {
  log.info('Using DSafe Registry and then SafeTransaction API. API Route:', [apiRoute])
}

export default async function handleDSafeRequest(
  composeClient: ComposeClient,
  httpMethod: 'POST' | 'GET' | 'DELETE',
  apiRoute: string,
  payload?: unknown,
  network?: string,
): Promise<boolean> {
  console.log('Handling:', apiRoute)
  const multiSigTransactionsRegex = /^v1\/safes\/([a-zA-Z0-9]+)\/multisig-transactions\/$/
  if (apiRoute === 'v1/data-decoder/') {
    return handleDataDecoder(composeClient, payload, network)
  }
  if (multiSigTransactionsRegex.test(apiRoute)) {
    console.log('Create Transction')
    return await handleCreateTransaction(
      composeClient,
      payload as CreateTransactionPayload,
      network,
    )
  }
  log.info('Using Safe Transaction API instead of DSafe Registry. API Route:', [apiRoute])
  return true
}
