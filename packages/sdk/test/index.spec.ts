// import chai from 'chai'
import dotenv from 'dotenv'
import DSafe from '../src/index.js'
import { describe, expect } from '@jest/globals'
import { API_ENDPOINT } from '../src/config/constants.js'
import { ERROR_CODE } from '../src/config/ERROR_CODES.js'
import NETWORKS from '../src/config/networks.js'
import Logger from '../src/utils/Logger.utils.js'
import { type Wallet, ethers } from 'ethers'
import { getSafeSingletonDeployment } from '@safe-global/safe-deployments'
import { type GetSafePayload } from '../src/types/GET_SAFE_PAYLOAD.type.js'
import { type GetAllTransactionsPayload } from '../src/types/GET_ALL_TRANSACTIONS.js'
import { type GetTransactionPayload } from '../src/types/GET_TRANSACTION_PAYLOAD.type.js'
import { type GetTransactionConfirmationsPayload } from '../src/types/GET_TRANSACTION_CONFIRMATIONS_PAYLOAD.type.js'
import { type UpdateDelegatePayload } from '../src/types/CREATE_DELEGATE.type.js'
import { type GetDelegatesPayload } from '../src/types/GET_DELEGATES.type.js'
import { arrayify } from 'ethers/lib/utils.js'
import {
  SAFE_ADDRESS,
  TEST_ACCOUNT,
  ceramicNodeNetwork,
  delegateAddress,
  network,
  testUsdt,
  trxInput,
} from './secrets.js'
import axios, { type AxiosRequestConfig } from 'axios'

dotenv.config({ path: './.env' })
const log = new Logger()
// const expect = chai.expect

const PRIVATE_KEY = process.env.PRIVATE_KEY

describe('DSafe: Forward API request to Safe API endpoint', () => {
  const chainId: string = NETWORKS.SEPOLIA

  let dsafe: DSafe
  let signer: Wallet
  const demoApiRouteWithoutSlash: string = 'sendTransactions'
  const demoApiRouteWithSlash: string = '/sendTransactions'
  const testAccountOnSepolia = TEST_ACCOUNT
  const testSafeOnSepolia = SAFE_ADDRESS
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

    signer = new ethers.Wallet(PRIVATE_KEY as string)
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
    expect(result.status).toBe(true)
  }, 100000)
  it('should fetch all the safes of an owner', async () => {
    const apiRoute = `/v1/owners/${testAccountOnSepolia}/safes`
    const options: AxiosRequestConfig = {}
    options.method = 'GET'
    options.url = dsafe.generateApiUrl(apiRoute)
    const expectedResult = await axios.request(options)
    const result = await dsafe.fetchLegacy('GET', apiRoute)
    log.info('Data returned from :', [result.data?.safes, expectedResult.data?.safes])
    expect(result.data?.safes).toStrictEqual(expectedResult.data?.safes)
  }, 10000)
  it('should use dSafe registry for Data decoder', async () => {
    const decodeDataroute = '/v1/data-decoder/'
    const usdt = new ethers.Contract(testUsdt, totalSupplyAbi)
    const encodedData = usdt.interface.encodeFunctionData('balanceOf', [testAccountOnSepolia])
    const payload = {
      apiData: {
        data: encodedData,
      },
    }
    const result = await dsafe.fetchLegacy('POST', decodeDataroute, payload)
    expect(result.data?.parameters[0].value).toBe(testAccountOnSepolia)
  })
  it('should be able to create new transaction', async () => {
    const safeAddress = SAFE_ADDRESS
    const createTransactionRoute = `/v1/safes/${safeAddress}/multisig-transactions/`

    const safeAbi = getSafeSingletonDeployment()?.abi
    if (safeAbi === undefined) {
      throw Error('Safe ABI is undefined')
    }
    const provider = new ethers.providers.InfuraProvider(chainId, process.env.INFURA_PROJECT_ID)
    // const signer = new ethers.BaseWallet(new ethers.SigningKey(PRIVATE_KEY as string), provider)
    const signer = new ethers.Wallet(PRIVATE_KEY as string, provider)
    console.log({ signer })

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
    console.log({ safeTrxHash })

    const signature = (await signer.signMessage(arrayify(safeTrxHash)))
      .replace(/1b$/, '1f')
      .replace(/1c$/, '20')

    console.log({ signature })

    // todo: add correct payload

    const signerAddress = await signer.getAddress()
    const payload = {
      safe: safeAddress,
      sender: signer.address,
      contractTransactionHash: safeTrxHash,
      to: trxInput.to,
      data: trxInput.data,
      baseGas: trxInput.baseGas,
      gasPrice: trxInput.gasPrice,
      safeTxGas: trxInput.safeTxGas,
      value: trxInput.value,
      operation: trxInput.operation.toString(),
      nonce: trxInput.nonce,
      signature,
      apiData: {
        safe: safeAddress,
        sender: signerAddress,
        contractTransactionHash: safeTrxHash,
        to: trxInput.to,
        data: trxInput.data,
        gasToken: trxInput.gasToken,
        baseGas: trxInput.baseGas,
        gasPrice: trxInput.gasPrice,
        refundReceiver: trxInput.refundReceiver,
        safeTxGas: trxInput.safeTxGas,
        value: trxInput.value,
        operation: trxInput.operation,
        nonce: trxInput.nonce,
        signature,
      },
    }

    const options: AxiosRequestConfig = {}
    options.method = 'POST'
    options.url = dsafe.generateApiUrl(createTransactionRoute, chainId)
    if (payload?.apiData !== undefined) {
      options.data = payload.apiData
    }
    try {
      const result = await axios.request(options)
      console.log({ result })
    } catch (e: any) {
      console.log({ e: e.response.data })
      throw e
    }
    // console.log('DEBUG LOGS', { signer, apiData: payload.apiData, trxInput })
    const dsafeResponse = await dsafe.fetchLegacy('POST', createTransactionRoute, payload, chainId)
    console.log({ dsafeResponse })

    expect(dsafeResponse.status).toBe(true)
  }, 100000)
  it('should be able to add new confirmation to existing transaction', async () => {
    const safeAddress = SAFE_ADDRESS

    const safeAbi = getSafeSingletonDeployment()?.abi
    if (safeAbi === undefined) {
      throw Error('Safe ABI is undefined')
    }

    console.log('This is working')
    const provider = new ethers.providers.InfuraProvider(chainId, process.env.INFURA_PROJECT_ID)

    console.log('This is working')
    // const signer = new ethers.BaseWallet(new ethers.SigningKey(PRIVATE_KEY as string), provider)
    const signer = new ethers.Wallet(PRIVATE_KEY as string, provider)
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
    const signature = (await signer.signMessage(arrayify(safeTrxHash)))
      .replace(/1b$/, '1f')
      .replace(/1c$/, '20')
    console.log('This is working')

    const payload = {
      apiData: {
        signature,
      },
      safe: safeAddress,
      signature,
      safe_tx_hash: safeTrxHash,
      sender: signer.address,
    }

    try {
      const apiResponse = await axios.post(
        dsafe.generateApiUrl(updateConfirmationRoute, chainId),
        payload.apiData,
      )

      console.log('This is working', { apiResponse })
    } catch (err) {
      console.error({ err })
    }

    const result = await dsafe.fetchLegacy('POST', updateConfirmationRoute, payload, chainId)
    console.log(result)
  }, 100000)
  it('get safe data', async () => {
    const safeAddress = SAFE_ADDRESS
    const getSafeRoute = `/v1/safes/${safeAddress}/`
    const payload: GetSafePayload = {
      address: safeAddress,
    }
    const apiResponse = await axios.request({ url: dsafe.generateApiUrl(getSafeRoute, chainId) })
    const response = await dsafe.fetchLegacy('GET', getSafeRoute, payload, chainId)

    console.log({ apiResponse: apiResponse.data.owners, response: response.data.owners })

    expect(response.data).toMatchObject(apiResponse.data)
  })
  it('get all transactions', async () => {
    const safeAddress = SAFE_ADDRESS
    const getTransactionsRoute = `/v1/safes/${safeAddress}/multisig-transactions/`
    const payload: GetAllTransactionsPayload = {
      address: safeAddress,
    }
    const apiResponse = await axios.request({
      url: dsafe.generateApiUrl(getTransactionsRoute, chainId),
    })

    const response = await dsafe.fetchLegacy('GET', getTransactionsRoute, payload, network)
    console.log({ apiResponse: apiResponse.data, response })
    expect(response.status).toBe(true)
    expect(response.data.count).not.toEqual(0)
    expect(response.data.count).toBeLessThanOrEqual(apiResponse.data.count)
    expect(response.data.results).toBeTruthy()
  })
  it('Get a transaction using safeTxHash', async () => {
    const safeAddress = SAFE_ADDRESS

    const safeAbi = getSafeSingletonDeployment()?.abi
    if (safeAbi === undefined) {
      throw Error('Safe ABI is undefined')
    }

    const provider = new ethers.providers.InfuraProvider(chainId, process.env.INFURA_PROJECT_ID)
    const signer = new ethers.Wallet(PRIVATE_KEY as string, provider)
    const safeInstance = new ethers.Contract(safeAddress, safeAbi, signer)
    const safeTxHash = await safeInstance.getTransactionHash(
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
    const getTransactionRoute = `/v1/multisig-transactions/${safeTxHash}/`
    const payload: GetTransactionPayload = {
      safeTxHash,
    }
    const apiResponse = await axios.request({
      url: dsafe.generateApiUrl(getTransactionRoute, chainId),
    })
    const response = await dsafe.fetchLegacy('GET', getTransactionRoute, payload, chainId)

    console.log({ apiResponse, response })
    expect(response.status).toBe(true)
    expect(response.data.safeTransactionHash).toBe(apiResponse.data.safeTxHash)
    expect(response.data.nonce).toBe(apiResponse.data.nonce)
  })
  it('Get confirmations for a safeTrxHash', async () => {
    const safeAddress = SAFE_ADDRESS

    const safeAbi = getSafeSingletonDeployment()?.abi
    if (safeAbi === undefined) {
      throw Error('Safe ABI is undefined')
    }
    const provider = new ethers.providers.InfuraProvider(chainId, process.env.INFURA_PROJECT_ID)
    const signer = new ethers.Wallet(PRIVATE_KEY as string, provider)
    const safeInstance = new ethers.Contract(safeAddress, safeAbi, signer)
    const safeTxHash = await safeInstance.getTransactionHash(
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

    const getConfirmationRoute = `/v1/multisig-transactions/${safeTxHash}/confirmations/`
    const apiResponse = await axios.request({
      url: dsafe.generateApiUrl(getConfirmationRoute, chainId),
    })

    const payload: GetTransactionConfirmationsPayload = {
      safeTxHash,
    }

    const response = await dsafe.fetchLegacy('GET', getConfirmationRoute, payload, chainId)
    console.log('GETTING CONFIRMATIONS', {
      apiResponse: apiResponse.data.results,
      response: response.data,
    })

    const filteredAPIResponse = apiResponse.data.results.filter((confirmationA: any) => {
      console.log({ signatureA: confirmationA.signature, signatureB: response.data })
      return response.data.some(
        (confirmationB: any) => confirmationA.signature === confirmationB.signature,
      )
    })

    console.log({ filteredAPIResponse })

    expect(filteredAPIResponse.length).toBeGreaterThan(0)
  })
  it('Create new delegate', async () => {
    const addDelegateApiRoute = '/v1/delegates/'
    const label = 'delegator'
    const totp = Math.floor(Math.floor(Date.now() / 1000) / 3600)
    const signatureForDelegate = await signer.signMessage(delegateAddress + totp)
    if (PRIVATE_KEY !== undefined) {
      // generate signature to add delegate
      if (PRIVATE_KEY === undefined) {
        throw Error('Private key invalid')
      }

      const payload: UpdateDelegatePayload = {
        safe: testSafeOnSepolia,
        delegate: delegateAddress,
        delegator: signer.address,
        signature: signatureForDelegate,
        label,
        apiData: {
          safe: testSafeOnSepolia,
          delegate: delegateAddress,
          delegator: signer.address,
          signature: signatureForDelegate,
          label,
        },
      }
      await axios.post(dsafe.generateApiUrl(addDelegateApiRoute, chainId), payload.apiData)

      const response = await dsafe.fetchLegacy('POST', addDelegateApiRoute, payload, network)
      expect(response.status).toBeTruthy()
    }
  })
  it('Get delegates', async () => {
    const getDelegateApiRoute = `/v1/delegates/?safe=${testSafeOnSepolia}`
    const payload: GetDelegatesPayload = {
      safeAddress: testSafeOnSepolia,
    }
    const apiResponse = await axios.get(dsafe.generateApiUrl(getDelegateApiRoute, chainId))

    const response = await dsafe.fetchLegacy('GET', getDelegateApiRoute, payload, network)
    apiResponse.data.results.forEach((result: any) => {
      delete result.label
    })
    console.log({ apiResponse: apiResponse.data.results, response: response.data })
    response.data.forEach((delegateData: any) => {
      expect(apiResponse.data.results).toContainEqual(delegateData)
    })
  })
})
