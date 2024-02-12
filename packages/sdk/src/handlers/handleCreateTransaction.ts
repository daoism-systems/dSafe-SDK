import { type ComposeClient } from '@composedb/client'
import { type CreateTransactionPayload } from '../types/CREATE_TRANSACTION_PAYLOAD.type.js'
import { checkSafeExists } from '../composedb/queries/querySafe.js'
import { checkSignerExists } from '../composedb/queries/querySigner.js'
import { composeSafe } from '../composedb/mutations/mutateSafe.js'
import axios from 'axios'
import {
  API_ENDPOINT,
  EMPTY_TRANSACTION_DATA,
  STATUS_CODE_201,
  STATUS_CODE_400,
  ZERO_ADDRESS_GAS_TOKEN,
  ZERO_ADDRESS_REFUND_RECEIVER,
} from '../config/constants.js'
import { composeSigner } from '../composedb/mutations/mutateSigner.js'
import { composeTransaction } from '../composedb/mutations/mutateTransaction.js'
import { checkTransactionExists } from '../composedb/queries/queryTransaction.js'
import { composeConfirmation } from '../composedb/mutations/mutateConfirmation.js'
import { checkConfirmationExists } from '../composedb/queries/queryConfirmation.js'
import { composeSignerSafe } from '../composedb/mutations/mutateSignerSafe.js'
import { checkSignerSafeExists } from '../composedb/queries/querySignerSafe.js'
import { type DSafeResponse } from './handler.js'
import type RouteHandler from '../types/ROUTE_HANDLER.type.js'

const handleCreateTransaction: RouteHandler<CreateTransactionPayload> = async (
  composeClient: ComposeClient,
  payload?: CreateTransactionPayload,
  network?: string,
): Promise<DSafeResponse> => {
  // check if safe exists, if not, create safe
  if (payload === undefined) {
    throw Error('Payload cannot be undefined for Create Transaction')
  }
  if (payload.safe === undefined) {
    throw Error('Please provide safe address using payload.safeAddress')
  }
  if (network === undefined) {
    throw Error('Please provide the network the safe is deployed on')
  }
  const safeExist = await checkSafeExists(payload.safe, composeClient)
  console.log(safeExist)
  let safeStreamId: string | undefined = safeExist.id
  // get safe data from API Service
  const response = await axios.get(`${API_ENDPOINT(network)}/v1/safes/${payload.safe}`)
  // todo: add checks when response fails
  // validateResponse(response);
  // todo: add checks: safeTxHash is valid
  // validateSafeTxHash(payload.safeTxHash);
  // todo: add checks: whether sender is signer or not (and then whether sender is delegate)
  // todo: add checks: signature is valid
  // const isDelegate: bool = validateSignatureBySignerOrDelegate(payload.signature, payload.sender);
  // todo: add function to fetch current native balance
  // const nativeTokenBalance = fetchTokenBalance(payload.safe);
  const nativeTokenBalance = '0'
  // todo: add function to fetch the block number when the contract was deployed
  // const deployedBlockNumber = fetchDeployedBlockNumber(payload.safe);
  const deployedBlockNumber = 10

  // todo: find caip network ID for network string
  const networkId = 'eip155:1'

  const data = response.data
  console.log({ data: JSON.stringify(response.data) })

  if (!safeExist.exists) {
    console.log('Composing Safe')
    const input = {
      content: {
        network: networkId,
        singleton: data.masterCopy,
        threshold: data.threshold,
        nonce: data.nonce, // currently this nonce represent the total transaction executed on-chain
        safeAddress: payload.safe,
        fallbackHandler: data.fallbackHandler,
        guard: data.guard,
        version: data.version,
        totalTransactions: data.nonce, // currently assuming users do not skip any nonce value
        nativeTokenBalance,
        deployedBlockNumber,
      },
    }
    console.log('Creating new safe on ComposeDB...')
    await composeSafe(input, composeClient)
    const safeCreated = await checkSafeExists(payload.safe, composeClient)
    console.log(`Safe Created: ${safeCreated.exists}`)
    safeStreamId = safeCreated.id
  }
  // for now, only focus on signer sending transaction
  const signerExist = await checkSignerExists(payload.sender, composeClient)
  let signerStreamId: string | undefined = signerExist.id
  let signerSafeStreamId: string | undefined
  if (!signerExist.exists && data.owners.includes(payload.sender) === true) {
    console.log('Sender is signer but is not Signer entity is not created for the sender')
    const input = {
      content: {
        signer: payload.sender,
      },
    }
    await composeSigner(input, composeClient)
    const signerCreated = await checkSignerExists(payload.sender, composeClient)
    console.log(`Signer Created: ${signerCreated.exists}`)
    signerStreamId = signerCreated.id
    // create signer safe relationship
    console.log('Signer created, now create Signer Safe relationship')
    const signerSafeInput = {
      content: {
        signerID: signerStreamId,
        safeID: safeStreamId,
        network: networkId,
        blockWhenAdded: deployedBlockNumber,
      },
    }
    await composeSignerSafe(signerSafeInput, composeClient)
    const signerSafeRelationshipCreated = await checkSignerSafeExists(
      signerStreamId as string,
      safeStreamId as string,
      networkId,
      composeClient,
    )
    console.log(`Signer Safe relationship: ${signerSafeRelationshipCreated.exists}`)
    signerSafeStreamId = signerSafeRelationshipCreated.id
    console.log(`Signer Safe Relationship Stream ID: ${signerSafeStreamId}`)
  }

  console.log(safeStreamId, signerStreamId)

  // if nonce already used, overwrite existing
  // note: this is same behaviour as Safe Transaction Service
  const input = {
    content: {
      safeTransactionHash: payload.contractTransactionHash,
      to: payload.to,
      baseGas: payload.baseGas,
      gasPrice: payload.gasPrice,
      safeTxGas: payload.safeTxGas,
      value: payload.value,
      refundReceiver: payload.refundReceiver ?? ZERO_ADDRESS_REFUND_RECEIVER,
      data: payload.data ?? EMPTY_TRANSACTION_DATA,
      operation: payload.operation,
      gasToken: payload.gasToken ?? ZERO_ADDRESS_GAS_TOKEN,
      nonce: payload.nonce,
      sender: payload.sender,
      signature: payload.signature,
      safeID: safeStreamId,
      network: networkId,
    },
  }
  const transactionExists = await checkTransactionExists(
    payload.nonce,
    safeStreamId as string,
    composeClient,
  )
  if (!transactionExists.exists) {
    await composeTransaction(input, composeClient)
    const transactionCreated = await checkTransactionExists(
      payload.nonce,
      safeStreamId as string,
      composeClient,
    )
    console.log(`Transaction created: ${transactionCreated.exists}`)
    // add confirmation
    // if transaction doesn't exist, we assume the confirmation doesn't exist too
    const confirmationInput = {
      content: {
        signerID: signerStreamId,
        transactionId: transactionCreated.id,
        signature: payload.signature,
      },
    }
    await composeConfirmation(confirmationInput, composeClient)
    const confirmationCreated = await checkConfirmationExists(
      confirmationInput.content.signerID as string,
      `${confirmationInput.content.transactionId}`,
      composeClient,
    )
    console.log(`Confirmation Created: ${confirmationCreated.exists}`)

    return { status: true, data: STATUS_CODE_201 }
  } else {
    return { status: false, data: STATUS_CODE_201 }
    // throwError('Transaction already exists!')
    // return { status: false, data: null }
    // todo:
    // await updateTransaction(input, composeClient);
    // update transaction and add confirmation of sender
    // and remove all other confirmations because the transaction has been updated
    // const confirmationExists = await checkConfirmationExists()
  }
  return { status: false, data: STATUS_CODE_400 }
}

export default handleCreateTransaction
