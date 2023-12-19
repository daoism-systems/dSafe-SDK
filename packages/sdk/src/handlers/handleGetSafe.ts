import { ComposeClient } from '@composedb/client';
import RouteHandler from '../types/ROUTE_HANDLER.type.js';
import { GetSafePayload } from '../types/GET_SAFE_PAYLOAD.type.js';
import { getSafe } from '../composedb/queries/querySafe.js';
// GET /v1/safes/{address}/

const handleGetSafe: RouteHandler<GetSafePayload> = async (
  composeClient: ComposeClient,
  payload?: GetSafePayload,
  network?: string,
) => {
    if(payload?.address === undefined){
        throw Error("Safe address not defined in payload");
    }
    const getSafeResponse = await getSafe(payload?.address, composeClient);
    console.log(getSafeResponse);
    return getSafeResponse.exists;
}

export default handleGetSafe;
