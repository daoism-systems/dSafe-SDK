import { CeramicClient } from '@ceramicnetwork/http-client'
import { ComposeClient } from '@composedb/client'
import { API_ENDPOINT, CERAMIC_NETWORKS } from '../config/constants.js'
import Logger from '../utils/Logger.utils.js'
import axios, { type AxiosResponse, type AxiosRequestConfig } from 'axios'
import { throwError } from '../utils/error.utils.js'
import { ERROR_CODE } from '../config/ERROR_CODES.js'
import handleDSafeRequest from '../handlers/handler.js'
import { type CeramicNetwork } from '../types/SAFE_API_NETWORK.types.js'
import { definition } from '../../__generated__/definitions.dev.js'
import { type RuntimeCompositeDefinition } from '@composedb/types'
import { fromString } from 'uint8arrays'
import { DID } from 'dids'
import { getResolver } from 'key-did-resolver'
import { Ed25519Provider } from 'key-did-provider-ed25519'
const log = new Logger()

export default class DSafe {
  initialised: boolean = false
  network: string = ''
  ceramicClient: CeramicClient
  composeClient: ComposeClient
  did: DID | undefined

  constructor(
    network: string,
    ceramicNetwork: keyof CeramicNetwork,
    ceramicNetworkOverride?: string,
  ) {
    const ceramicNodeUrlToUse =
      ceramicNetworkOverride === undefined
        ? CERAMIC_NETWORKS[ceramicNetwork]
        : ceramicNetworkOverride
    this.initialised = true
    this.network = network
    this.ceramicClient = new CeramicClient(ceramicNodeUrlToUse)
    this.composeClient = new ComposeClient({
      ceramic: ceramicNodeUrlToUse,
      definition: definition as RuntimeCompositeDefinition,
    })
    log.info('DSafe SDK initialised. Chain ID and Ceramic Node URL', [network, ceramicNodeUrlToUse])
  }

  async initializeDIDOnNode(privateKey: string): Promise<void> {
    // generate DID
    if (privateKey === '') {
      console.log('Private key cannot be empty')
      throw Error('Private Key empty!')
    }
    const key = fromString(privateKey.toString().slice(2), 'base16')
    const did = new DID({
      resolver: getResolver(),
      provider: new Ed25519Provider(key),
    })
    await did.authenticate()
    this.did = did
    this.composeClient.setDID(did)
  }

  async initializeDIDOnClient(): Promise<void> {}

  /**
   * @function generateApiUrl Generate API url
   * @param apiRoute endpoint route eg. '/about' etc.
   * @returns generated API URL to interact with Server
   */
  generateApiUrl(apiRoute: string, network?: string): string {
    if (apiRoute === '') {
      throwError(ERROR_CODE.API_ROUTE_PROVIDED_EMPTY)
    }
    let apiUrl: string = API_ENDPOINT(network ?? this.network)
    if (apiRoute[0] === '/') {
      apiUrl = `${apiUrl}${apiRoute}`
    } else {
      apiUrl = `${apiUrl}/${apiRoute}`
    }
    return apiUrl
  }

  // create types for options parameters
  /**
   * @function fetchLegacy Interact with routes that are not implemented yet
   * @param httpMethod GET | POST | DELETE
   * @param apiRoute endpoint route eg. '/about' etc.
   * @param payload payload/data/body to be sent to api route
   * @returns axios response after interacting with api route
   */
  async fetchLegacy(
    httpMethod: 'POST' | 'GET' | 'DELETE',
    apiRoute: string,
    payload?: any,
    network?: string,
  ): Promise<AxiosResponse> {
    console.log('Fetching...')
    const apiUrl = this.generateApiUrl(apiRoute, network)
    const status = await handleDSafeRequest(
      this.composeClient,
      httpMethod,
      apiRoute,
      payload,
      network,
    )
    if (!status) {
      log.error('DSafe request failed, execution stopped!', [])
      throw Error('dSafe request failed')
    }
    log.info('Fetch route:', [apiUrl])
    const options: AxiosRequestConfig = {}
    options.method = httpMethod
    options.url = apiUrl
    if (payload?.apiData !== undefined) {
      options.data = payload.apiData
    }
    try {
      const result = await axios.request(options)
      return result
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}
