import chai from 'chai'

import DSafe from '../src/index'
import { API_ENDPOINT, STATUS_CODE_200 } from '../src/config/constants'
import { ERROR_CODE } from '../src/config/ERROR_CODES'
import NETWORKS from '../src/config/networks'
import Logger from '../src/utils/Logger.utils'
const log = new Logger()
const expect = chai.expect

describe('DSafe: Forward API request to Safe API endpoint', () => {
  const chainId = NETWORKS.GOERI
  let dsafe: DSafe
  const demoApiRouteWithoutSlash: string = 'sendTransactions'
  const demoApiRouteWithSlash: string = '/sendTransactions'
  const testAccountOnGoerli = '0x9cA70B93CaE5576645F5F069524A9B9c3aef5006'
  const emptyApi: string = ''
  beforeEach('>> Instantiate Dsafe instance', () => {
    dsafe = new DSafe()
  })
  it('DSafe instance is initialised with correct chain ID', () => {
    // @eslint-ignore
    expect(dsafe.initialised).to.be.true;
  })
  it('Should generate correct API URL', () => {
    expect(dsafe.generateApiUrl(demoApiRouteWithoutSlash)).to.equal(
      `${API_ENDPOINT}/${demoApiRouteWithoutSlash}`,
    )
    expect(dsafe.generateApiUrl(demoApiRouteWithSlash)).to.equal(
      `${API_ENDPOINT}${demoApiRouteWithSlash}`,
    )
  })
  it('Should throw error if api route is empty string', () => {
    const wrappedFunction = (): string => dsafe.generateApiUrl(emptyApi)
    expect(wrappedFunction).to.throw(ERROR_CODE.API_ROUTE_PROVIDED_EMPTY)
  })
  it('Should get about the API', async () => {
    const result = await dsafe.fetchLegacy('GET', '/about')
    expect(result.status).to.equal(STATUS_CODE_200)
  })
  it('should fetch all the safes of an owner', async () => {
    const apiRoute = `/v1/chains/${chainId}/owners/${testAccountOnGoerli}/safes`
    const result = await dsafe.fetchLegacy('GET', apiRoute)
    log.info('Data returned from API:', [result.data])
    expect(result.status).to.equal(STATUS_CODE_200)
  })
})
