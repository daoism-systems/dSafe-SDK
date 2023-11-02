import { API_ENDPOINT } from '../config/constants'
import Logger from '../utils/Logger.utils'
import axios, { type AxiosResponse, type AxiosRequestConfig } from 'axios'
import { throwError } from '../utils/error.utils'
import { ERROR_CODE } from '../config/ERROR_CODES'
const log = new Logger()

export default class DSafe {
  initialised: boolean = false

  constructor() {
    this.initialised = true
    log.info('DSafe SDK initialised. Chain ID:', [])
  }

  /**
   * @function generateApiUrl Generate API url
   * @param apiRoute endpoint route eg. '/about' etc.
   * @returns generated API URL to interact with Server
   */
  generateApiUrl(apiRoute: string): string {
    if (apiRoute === '') {
      throwError(ERROR_CODE.API_ROUTE_PROVIDED_EMPTY)
    }
    let apiUrl: string = API_ENDPOINT
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
  async fetchLegacy(httpMethod: 'POST' | 'GET' | 'DELETE', apiRoute: string, payload?: unknown): Promise<AxiosResponse> {
    log.info('Using Safe Transaction API instead of DSafe Registry. API Route:', [apiRoute])
    const apiUrl = this.generateApiUrl(apiRoute)
    const options: AxiosRequestConfig = {}
    options.method = httpMethod
    options.url = apiUrl
    if (payload !== undefined) {
      options.data = payload
    }
    const result = await axios.request(options)
    return result
  }
}
