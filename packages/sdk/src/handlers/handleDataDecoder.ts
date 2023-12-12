import { ComposeClient } from "@composedb/client"
import Logger from "../utils/Logger.utils.js"
import { handleDSafeLog } from "./handler.js"

const log = new Logger()
// api route
export default function handleDataDecoder(
    composeClient: ComposeClient,
    payload?: unknown,
    network?: string,
  ): boolean {
    handleDSafeLog('DATA Decoder')
    log.info('Handle Data Decoder', ['Data Decoer'])
    return true
  }