// import chai from 'chai'
import dotenv from 'dotenv'
import DSafe from '../src/index.js'
import { describe, expect } from '@jest/globals'
import { API_ENDPOINT, STATUS_CODE_200, STATUS_CODE_400 } from '../src/config/constants.js'
import { ERROR_CODE } from '../src/config/ERROR_CODES.js'
import NETWORKS from '../src/config/networks.js'
import Logger from '../src/utils/Logger.utils.js'
import { ethers, getBytes } from 'ethers'
import { getSafeSingletonDeployment } from '@safe-global/safe-deployments'
dotenv.config({ path: './.env' })
const log = new Logger()
// const expect = chai.expect

const PRIVATE_KEY = process.env.PRIVATE_KEY

describe('DSafe: Forward API request to Safe API endpoint', () => {
  const chainId: string = NETWORKS.GOERLI
  let dsafe: DSafe
  const ceramicNodeNetwork = 'local'
  const demoApiRouteWithoutSlash: string = 'sendTransactions'
  const demoApiRouteWithSlash: string = '/sendTransactions'
  const testAccountOnGoerli = '0x9cA70B93CaE5576645F5F069524A9B9c3aef5006'
  const testSafeOnGoerli = '0xa192aBe4667FC4d11e46385902309cd7421997ed'
  const delegateAddress = '0xADC81e65845cEca5B928fdd484A38B98E5f418B0'
  const testUsdt = '0xC11F33798F500bE942Ff2CA122790c2dc7c087E1'
  const totalSupplyAbi = [
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: 'balance',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ]
  const emptyApi: string = ''
  beforeEach(async () => {
    log.info('>> Instantiate Dsafe instance', [])
    dsafe = new DSafe(chainId, ceramicNodeNetwork)
    await dsafe.initializeDIDOnNode(PRIVATE_KEY as string)
  })
  it('DSafe instance is initialised with correct chain ID', () => {
    expect(dsafe.ceramicClient).toBeDefined()
    expect(dsafe.composeClient).toBeDefined()
    expect(dsafe.initialised).toBe(true)
  })
  it('Dsafe fails when private key is empty', async () => {
    const newDsafe = new DSafe(chainId, ceramicNodeNetwork)
    await expect(newDsafe.initializeDIDOnNode('')).rejects.toThrow('Private Key empty!')
  })
  it('Dsafe safely generates DID on Node', async () => {
    const newDsafe = new DSafe(chainId, ceramicNodeNetwork)
    expect(newDsafe.did).toBeUndefined()
    expect(newDsafe.composeClient.did).toBeUndefined()
    await newDsafe.initializeDIDOnNode(PRIVATE_KEY as string)
    expect(newDsafe.composeClient.did).toBeDefined()
    expect(newDsafe.did).toBeDefined()
  })
  it('Should generate correct API URL', () => {
    expect(dsafe.generateApiUrl(demoApiRouteWithoutSlash)).toBe(
      `${API_ENDPOINT(chainId)}/${demoApiRouteWithoutSlash}`,
    )
    expect(dsafe.generateApiUrl(demoApiRouteWithSlash)).toBe(
      `${API_ENDPOINT(chainId)}${demoApiRouteWithSlash}`,
    )
  })
  it('Should throw error if api route is empty string', () => {
    const wrappedFunction = (): string => dsafe.generateApiUrl(emptyApi)
    expect(wrappedFunction).toThrow(ERROR_CODE.API_ROUTE_PROVIDED_EMPTY)
  })
  it('Should get about the API', async () => {
    const result = await dsafe.fetchLegacy('GET', 'v1/about')
    expect(result.status).toBe(STATUS_CODE_200)
  }, 100000)
  it('should fetch all the safes of an owner', async () => {
    const apiRoute = `/v1/owners/${testAccountOnGoerli}/safes`
    const result = await dsafe.fetchLegacy('GET', apiRoute)
    log.info('Data returned from API:', [result.data])
    expect(result.status).toBe(STATUS_CODE_200)
  }, 10000)
  it('should post a new delegate to the safe', async () => {
    // add delegate
    const apiRoute = 'v1/delegates/' // add trailing forward slash to prevent server from doing GET

    if (PRIVATE_KEY !== undefined) {
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
      expect(postResult.status).not.toBe(STATUS_CODE_400)
    }

    // get delegate
    const delegates = await dsafe.fetchLegacy('GET', `${apiRoute}?safe=${testSafeOnGoerli}`)
    const delegateExist: number = delegates.data.results.findIndex(
      (element: any) => element.delegate === delegateAddress,
    )
    expect(delegates.data.results[delegateExist].delegate).toBe(delegateAddress)
  }, 100000)
  it('should use dSafe registry for Data decoder', async () => {
    const decodeDataroute = 'v1/data-decoder/'
    const usdt = new ethers.Contract(testUsdt, totalSupplyAbi)
    const encodedData = usdt.interface.encodeFunctionData('balanceOf', [testAccountOnGoerli])
    const payload = {
      data: encodedData,
    }
    const result = await dsafe.fetchLegacy('POST', decodeDataroute, payload)
    expect(result.data?.parameters[0].value).toBe(testAccountOnGoerli)
  })
  it('should be able to create new transaction', async () => {
    const safeAddress = '0xa192aBe4667FC4d11e46385902309cd7421997ed'
    const createTransactionRoute = `v1/safes/${safeAddress}/multisig-transactions/`

    const safeAbi = getSafeSingletonDeployment()?.abi
    if (safeAbi === undefined) {
      throw Error('Safe ABI is undefined')
    }
    const trxInput = {
      to: testUsdt,
      value: 1,
      data: '0x',
      operation: '0',
      safeTxGas: 0,
      baseGas: 0,
      gasPrice: 0,
      gasToken: '0x0000000000000000000000000000000000000000',
      refundReceiver: '0x0000000000000000000000000000000000000000',
      nonce: 13,
    }
    const provider = ethers.getDefaultProvider(chainId)
    const signer = new ethers.BaseWallet(new ethers.SigningKey(PRIVATE_KEY as string), provider)
    const safeInstance = new ethers.Contract(safeAddress, safeAbi, signer)
    const safeTrxHash = await safeInstance.getTransactionHash(
      trxInput.to,
      trxInput.value,
      trxInput.data,
      trxInput.operation,
      trxInput.safeTxGas,
      trxInput.baseGas,
      trxInput.gasPrice,
      trxInput.gasToken,
      trxInput.refundReceiver,
      trxInput.nonce,
    )
    const signature = (await signer.signMessage(getBytes(safeTrxHash)))
      .replace(/1b$/, '1f')
      .replace(/1c$/, '20')
    // todo: add correct payload
    const payload = {
      safe: safeAddress,
      sender: testAccountOnGoerli,
      contractTransactionHash: safeTrxHash,
      to: trxInput.to,
      data: trxInput.data,
      baseGas: trxInput.baseGas,
      gasPrice: trxInput.gasPrice,
      safeTxGas: trxInput.safeTxGas,
      value: trxInput.value,
      operation: trxInput.operation,
      nonce: trxInput.nonce,
      signature,
    }
    const result = await dsafe.fetchLegacy('POST', createTransactionRoute, payload, chainId)
  }, 100000)
  it('should be able to add new confirmation to existing transaction', async () => {
    const safeAddress = '0xa192aBe4667FC4d11e46385902309cd7421997ed'

    const safeAbi = getSafeSingletonDeployment()?.abi
    if (safeAbi === undefined) {
      throw Error('Safe ABI is undefined')
    }
    const trxInput = {
      to: testUsdt,
      value: 1,
      data: '0x',
      operation: '0',
      safeTxGas: 0,
      baseGas: 0,
      gasPrice: 0,
      gasToken: '0x0000000000000000000000000000000000000000',
      refundReceiver: '0x0000000000000000000000000000000000000000',
      nonce: 13,
    }
    console.log('This is working')
    const provider = ethers.getDefaultProvider(chainId)
    console.log('This is working')
    const signer = new ethers.BaseWallet(new ethers.SigningKey(PRIVATE_KEY as string), provider)
    const safeInstance = new ethers.Contract(safeAddress, safeAbi, signer)
    console.log('This is working')
    const safeTrxHash = await safeInstance.getTransactionHash(
      trxInput.to,
      trxInput.value,
      trxInput.data,
      trxInput.operation,
      trxInput.safeTxGas,
      trxInput.baseGas,
      trxInput.gasPrice,
      trxInput.gasToken,
      trxInput.refundReceiver,
      trxInput.nonce,
    )
    console.log('This is working')

    const updateConfirmationRoute = `/v1/multisig-transactions/${safeTrxHash}/confirmations/`
    console.log(safeTrxHash)
    console.log('This is working')
    const signature = (await signer.signMessage(getBytes(safeTrxHash)))
      .replace(/1b$/, '1f')
      .replace(/1c$/, '20')
    console.log('This is working')

    const payload = {
      data: {
        signature: signature,
      },
      safe: safeAddress,
      signature: signature,
      safe_tx_hash: safeTrxHash,
      sender: signer.address,
    }
    console.log('This is working')

    const result = await dsafe.fetchLegacy('POST', updateConfirmationRoute, payload, chainId)
    console.log(result)
  }, 100000)
})
