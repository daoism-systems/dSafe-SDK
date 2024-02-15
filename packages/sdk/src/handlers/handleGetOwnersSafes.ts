import { type ComposeClient } from '@composedb/client'
import type RouteHandler from '../types/ROUTE_HANDLER.type.js'
import { type GetOwnersSafesPayload } from '../types/GET_OWNERS_SAFES_PAYLOAD.type.js'
import { getOwnersSafes } from '../composedb/queries/querySafe.js'

const handleGetOwnersSafes: RouteHandler<GetOwnersSafesPayload> = async (
  composeClient: ComposeClient,
  payload?: GetOwnersSafesPayload,
  network?: string,
) => {
  if (payload?.address === undefined) {
    throw Error('Safe address not defined in payload')
  }
  const getSafeResponse = await getOwnersSafes(payload?.address, composeClient)
  console.log(getSafeResponse)
  return { status: true, data: getSafeResponse.data }
}

export default handleGetOwnersSafes
