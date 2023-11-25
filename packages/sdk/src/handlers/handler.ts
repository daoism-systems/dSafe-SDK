import Logger from '../utils/Logger.utils.js'

const log = new Logger()

function handleDSafeLog(apiRoute: string): void {
  log.info('Using DSafe Registry and then SafeTransaction API. API Route:', [apiRoute])
}
export default function handleDSafeRequest(
  httpMethod: 'POST' | 'GET' | 'DELETE',
  apiRoute: string,
  payload?: unknown,
  network?: string,
): void {
  switch (apiRoute) {
    case 'v1/data-decoder/':
      handleDataDecoder(apiRoute, payload, network)
      return
    default:
      log.info('Using Safe Transaction API instead of DSafe Registry. API Route:', [apiRoute])
  }
}

// api route
function handleDataDecoder(apiRoute: string, payload?: unknown, network?: string): void {
  handleDSafeLog(apiRoute)
  log.info('Handle Data Decoder', [apiRoute])
}
