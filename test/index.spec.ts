import chai from 'chai'
import dotenv from 'dotenv'
import DSafe from '../src/index'
import { API_ENDPOINT, STATUS_CODE_200, STATUS_CODE_400 } from '../src/config/constants'
import { ERROR_CODE } from '../src/config/ERROR_CODES'
import NETWORKS from '../src/config/networks'
import Logger from '../src/utils/Logger.utils'
import { ethers } from 'ethers'
dotenv.config({ path: './.env' })
const log = new Logger()
const expect = chai.expect

const PRIVATE_KEY = process.env.PRIVATE_KEY

describe('DSafe: Forward API request to Safe API endpoint', () => {
  const chainId: string = NETWORKS.GOERLI
  let dsafe: DSafe
  const demoApiRouteWithoutSlash: string = 'sendTransactions'
  const demoApiRouteWithSlash: string = '/sendTransactions'
  const testAccountOnGoerli = '0x9cA70B93CaE5576645F5F069524A9B9c3aef5006'
  const testSafeOnGoerli = '0xa192aBe4667FC4d11e46385902309cd7421997ed'
  const delegateAddress = '0xADC81e65845cEca5B928fdd484A38B98E5f418B0'
  const testUsdt = "0xC11F33798F500bE942Ff2CA122790c2dc7c087E1"
  const totalSupplyAbi = [{
    "constant": true,
    "inputs": [
        {
            "name": "_owner",
            "type": "address"
        }
    ],
    "name": "balanceOf",
    "outputs": [
        {
            "name": "balance",
            "type": "uint256"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}];
  const emptyApi: string = ''
  beforeEach('>> Instantiate Dsafe instance', () => {
    dsafe = new DSafe(chainId)
  })
  it('DSafe instance is initialised with correct chain ID', () => {
    expect(dsafe.initialised).to.be.true
  })
  it('Should generate correct API URL', () => {
    expect(dsafe.generateApiUrl(demoApiRouteWithoutSlash)).to.equal(
      `${API_ENDPOINT(chainId)}/${demoApiRouteWithoutSlash}`,
    )
    expect(dsafe.generateApiUrl(demoApiRouteWithSlash)).to.equal(
      `${API_ENDPOINT(chainId)}${demoApiRouteWithSlash}`,
    )
  })
  it('Should throw error if api route is empty string', () => {
    const wrappedFunction = (): string => dsafe.generateApiUrl(emptyApi)
    expect(wrappedFunction).to.throw(ERROR_CODE.API_ROUTE_PROVIDED_EMPTY)
  })
  it('Should get about the API', async () => {
    const result = await dsafe.fetchLegacy('GET', 'v1/about')
    expect(result.status).to.equal(STATUS_CODE_200)
  }).timeout(5000)
  it('should fetch all the safes of an owner', async () => {
    const apiRoute = `/v1/owners/${testAccountOnGoerli}/safes`
    const result = await dsafe.fetchLegacy('GET', apiRoute)
    log.info('Data returned from API:', [result.data])
    expect(result.status).to.equal(STATUS_CODE_200)
  }).timeout(5000)
  it('should post a new delegate to the safe', async () => {
    // add delegate
    const apiRoute = 'v1/delegates/' // add trailing forward slash to prevent server from doing GET

    if(PRIVATE_KEY !== undefined) {
      // generate signature to add delegate
    const TOTP = Math.floor(Math.floor(Date.now() / 1000) / 3600)
    const messageToSign = `${delegateAddress}${TOTP.toString()}`
    if (PRIVATE_KEY === undefined) {
      throw Error('Private key invalid')
    }
    const wallet = new ethers.Wallet(PRIVATE_KEY)
    const signature = await wallet.signMessage(messageToSign)

    // send POST request
    const payload = {
      safe: testSafeOnGoerli,
      delegate: delegateAddress,
      delegator: testAccountOnGoerli,
      signature,
      label: 'delegator',
    }
    const postResult = await dsafe.fetchLegacy('POST', apiRoute, payload)
    expect(postResult.status).not.equal(STATUS_CODE_400)
    }

    // get delegate
    const delegates = await dsafe.fetchLegacy('GET', `${apiRoute}?safe=${testSafeOnGoerli}`)
    const delegateExist: number = delegates.data.results.findIndex(
      (element: any) => element.delegate === delegateAddress,
    )
    expect(delegates.data.results[delegateExist].delegate).to.equal(delegateAddress)
  }).timeout(100000)
  it("should use dSafe registry for Data decoder", async () => {
    const decodeDataroute = 'v1/data-decoder/'
    const usdt = new ethers.Contract(testUsdt, totalSupplyAbi);
    const encodedData = usdt.interface.encodeFunctionData("balanceOf",[testAccountOnGoerli]);
    const payload = {
      data: encodedData
    }
    const result = await dsafe.fetchLegacy('POST', decodeDataroute, payload);
    expect(result.data?.parameters[0].value).to.equal(testAccountOnGoerli);
  })
})
