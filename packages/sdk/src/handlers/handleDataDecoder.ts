import { ComposeClient } from '@composedb/client'
import Logger from '../utils/Logger.utils.js'
import { handleDSafeLog } from './handler.js'
import RouteHandler from '../types/ROUTE_HANDLER.type.js'

const log = new Logger()

const handleDataDecoder: RouteHandler<any> = async (
  composeClient: ComposeClient,
  payload?: any,
  network?: string,
) => {
  handleDSafeLog('DATA Decoder')
  log.info('Handle Data Decoder', ['Data Decoer'])
  return true
}

export default handleDataDecoder