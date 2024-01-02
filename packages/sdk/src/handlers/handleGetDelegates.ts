import { ComposeClient } from '@composedb/client'
import RouteHandler from '../types/ROUTE_HANDLER.type.js'
import { getDelegate } from '../composedb/queries/queryDelegates.js'
import { GetDelegatesPayload } from '../types/GET_DELEGATES.type.js'
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
  let safeStreamId: string | undefined = safeExist.id
  const getDelegateResponse = await getDelegate(
    safeStreamId as string,
    network as string,
    composeClient,
  )
  console.log(getDelegateResponse)
  return getDelegateResponse.exists
}

export default handleGetDelegates
