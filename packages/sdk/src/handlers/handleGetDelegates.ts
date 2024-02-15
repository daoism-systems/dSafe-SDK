import { type ComposeClient } from '@composedb/client'
import type RouteHandler from '../types/ROUTE_HANDLER.type.js'
import { getDelegate } from '../composedb/queries/queryDelegates.js'
import { type GetDelegatesPayload } from '../types/GET_DELEGATES.type.js'
import { checkSafeExists } from '../composedb/queries/querySafe.js'
// GET /v1/delegates/

const handleGetDelegates: RouteHandler<GetDelegatesPayload> = async (
  composeClient: ComposeClient,
  payload?: GetDelegatesPayload,
  network?: string,
) => {
  if (payload?.safeAddress === undefined) {
    throw Error('Safe address not defined in payload')
  }
  const safeExist = await checkSafeExists(payload.safeAddress, composeClient)
  console.log(safeExist)
  const safeStreamId: string | undefined = safeExist.id
  const getDelegateResponse = await getDelegate(
    safeStreamId as string,
    network as string,
    composeClient,
  )
  console.log({ getDelegateResponse })
  return { status: getDelegateResponse.exists, data: getDelegateResponse.delegateData }
}

export default handleGetDelegates
