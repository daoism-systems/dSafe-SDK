import { API_ENDPOINT } from '../config/constants.js'
import Logger from '../utils/Logger.utils.js'
import axios, { type AxiosResponse, type AxiosRequestConfig } from 'axios'
import { throwError } from '../utils/error.utils.js'
import { ERROR_CODE } from '../config/ERROR_CODES.js'
import handleDSafeRequest from '../handlers/handler.js'
const log = new Logger()

export default class DSafe {
  initialised: boolean = false
  network: string = ''

  constructor(network: string) {
    this.initialised = true
    this.network = network
    log.info('DSafe SDK initialised. Chain ID:', [])
  }

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
    payload?: unknown,
    network?: string,
  ): Promise<AxiosResponse> {
    const apiUrl = this.generateApiUrl(apiRoute, network)
    handleDSafeRequest(httpMethod, apiRoute, payload, network)
    log.info('Fetch route:', [apiUrl])
    const options: AxiosRequestConfig = {}
    options.method = httpMethod
    options.url = apiUrl
    if (payload !== undefined) {
      options.data = payload
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