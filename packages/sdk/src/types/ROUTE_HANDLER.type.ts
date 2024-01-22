import { type ComposeClient } from '@composedb/client'

type RouteHandler<T> = (
  composeClient: ComposeClient,
  payload?: T,
  network?: string,
) => Promise<{ status: boolean; data: any } | boolean>

export default RouteHandler
