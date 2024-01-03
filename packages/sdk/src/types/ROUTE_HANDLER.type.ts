import { type ComposeClient } from '@composedb/client'

type RouteHandler<T> = (
  composeClient: ComposeClient,
  payload?: T,
  network?: string,
) => Promise<boolean>

export default RouteHandler
