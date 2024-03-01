import { CeramicClient } from '@ceramicnetwork/http-client'
import { ComposeClient } from '@composedb/client'
import { API_ENDPOINT, CERAMIC_NETWORKS } from '../config/constants.js'
import Logger from '../utils/Logger.utils.js'
// import axios, { type AxiosRequestConfig } from 'axios'
import { throwError } from '../utils/error.utils.js'
import { ERROR_CODE } from '../config/ERROR_CODES.js'
import handleDSafeRequest, {
  type DSafeResponseTypes,
  type DSafeResponse,
} from '../handlers/handler.js'
import { type CeramicNetwork } from '../types/SAFE_API_NETWORK.types.js'
import { definition } from '../../__generated__/definitions.dev.js'
import { type RuntimeCompositeDefinition } from '@composedb/types'
import { fromString } from 'uint8arrays'
import { DID } from 'dids'
import { getResolver } from 'key-did-resolver'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import axios, { type AxiosRequestConfig } from 'axios'
import { type HttpMethods } from '../types/HTTP_METHODS.type.js'
import { DIDSession } from 'did-session'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
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
    customDefinition?: RuntimeCompositeDefinition,
  ) {
    const definitionToUse = customDefinition ?? definition
    const ceramicNodeUrlToUse = ceramicNetworkOverride ?? CERAMIC_NETWORKS[ceramicNetwork]
    this.initialised = true
    this.network = network
    this.ceramicClient = new CeramicClient(ceramicNodeUrlToUse)
    this.composeClient = new ComposeClient({
      ceramic: ceramicNodeUrlToUse,
      definition: definitionToUse as RuntimeCompositeDefinition,
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

  async initializeDIDOnClient(window: any): Promise<void> {
    if (window?.ethereum === null || window?.ethereum === undefined) {
      throw new Error('No injected Ethereum provider found.')
    }
    const ethProvider = window.ethereum

    // request ethereum accounts.
    const addresses = await ethProvider.enable({
      method: 'eth_requestAccounts',
    })
    const accountId = await getAccountId(ethProvider, addresses[0])
    const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)

    const session = await DIDSession.get(accountId, authMethod, {
      resources: this.composeClient.resources,
    })
    this.did = session.did
    this.composeClient.setDID(session.did)
  }

  /**
   * @function generateApiUrl Generate API url
   * @param apiRoute endpoint route eg. '/about' etc.
   * @param network the network of target safe
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
   * @param network the network of target safe
   * @returns axios response after interacting with api route
   */
  async fetchLegacy(
    httpMethod: HttpMethods,
    apiRoute: string,
    payload?: any,
    network?: string,
  ): Promise<DSafeResponse> {
    let responseType: DSafeResponseTypes = 'SDK'
    console.log('Fetching...', apiRoute)
    // const apiUrl = this.generateApiUrl(apiRoute, network)
    const response = await handleDSafeRequest(
      this.composeClient,
      httpMethod,
      apiRoute,
      payload,
      network,
    )
    console.log({ response })

    if (!response.status && httpMethod !== 'DSAFE') {
      const apiUrl = this.generateApiUrl(apiRoute, network)
      log.error('DSafe request failed, execution stopped!', [])
      log.info('Fetch route:', [apiRoute])
      const options: AxiosRequestConfig = {}
      options.method = httpMethod
      options.url = apiUrl
      if (payload?.apiData !== undefined) {
        options.data = payload.apiData
      }
      try {
        const result = await axios.request(options)
        console.log({ result })
        responseType = 'API'
        return { status: true, data: result.data, responseType }
      } catch (e: any) {
        console.error({
          error: {
            status: e.status,
            message: e.message,
            data: JSON.stringify(e.response.data),
          },
        })
        return e
      }
    }
    response.responseType = responseType
    return response
  }
}
