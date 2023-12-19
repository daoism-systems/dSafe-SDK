import { ComposeClient } from '@composedb/client'
import { CreateTransactionPayload } from './CREATE_TRANSACTION_PAYLOAD.type.js'

type RouteHandler<T> = (
  composeClient: ComposeClient,
  payload?: T,
  network?: string,
) => Promise<boolean>

export default RouteHandler
