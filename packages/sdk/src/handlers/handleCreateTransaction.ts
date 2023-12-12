import { ComposeClient } from "@composedb/client"
import { CreateTransactionPayload } from "../types/CREATE_TRANSACTION_PAYLOAD.type.js"
import { checkSafeExists } from '../composedb/queries/querySafe.js'
import { checkSignerExists } from '../composedb/queries/querySigner.js'
import { composeSafe } from '../composedb/mutations/mutateSafe.js'
import axios from 'axios'
import { API_ENDPOINT, EMPTY_TRANSACTION_DATA, ZERO_ADDRESS_GAS_TOKEN, ZERO_ADDRESS_REFUND_RECEIVER } from '../config/constants.js'
import { composeSigner } from '../composedb/mutations/mutateSigner.js'
import { composeTransaction } from '../composedb/mutations/mutateTransaction.js'
import { checkTransactionExists } from '../composedb/queries/queryTransaction.js'
import { composeConfirmation } from '../composedb/mutations/mutateConfirmation.js'
import { checkConfirmationExists } from '../composedb/queries/queryConfirmation.js'

export default async function handleCreateTransaction(
    composeClient: ComposeClient,
    payload?: CreateTransactionPayload,
    network?: string,
  ): Promise<boolean> {
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
    const nativeTokenBalance = '0';
    // todo: add function to fetch the block number when the contract was deployed
    // const deployedBlockNumber = fetchDeployedBlockNumber(payload.safe);
    const deployedBlockNumber = 10;

    // todo: find caip network ID for network string
    const networkId = 'eip155:1';
  
    const data = response.data
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
          nativeTokenBalance: nativeTokenBalance, 
          deployedBlockNumber: deployedBlockNumber,
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
    if (!signerExist.exists && data.owners.includes(payload.sender)) {
      console.log('Sender is signer but isn\'t Signer entity isn\'t created for the sender')
      const input = {
        content: {
          signer: payload.sender,
        },
      }
      await composeSigner(input, composeClient)
      const signerCreated = await checkSignerExists(payload.sender, composeClient)
      console.log(`Signer Created: ${signerCreated.exists}`)
      signerStreamId = signerCreated.id
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
        refundReceiver:
          payload.refundReceiver === undefined
            ? ZERO_ADDRESS_REFUND_RECEIVER
            : payload.refundReceiver,
        data: payload.data === undefined ? EMPTY_TRANSACTION_DATA : payload.data,
        operation: payload.operation,
        gasToken:
          payload.gasToken === undefined
            ? ZERO_ADDRESS_GAS_TOKEN
            : payload.gasToken,
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
        confirmationInput.content.transactionId,
        composeClient,
      )
      console.log(`Confirmation Created: ${confirmationCreated.exists}`)
    } else {
      // todo:
      // await updateTransaction(input, composeClient);
      // update transaction and add confirmation of sender
      // and remove all other confirmations because the transaction has been updated
      // const confirmationExists = await checkConfirmationExists()
    }
    // // check if sender is valid signer
    // const isSenderValidSigner = checkIfSignerIsValidSigner();
    // const signerExist = checkSignerExist();
    // const signerSafeRelationExist = checkSignerSafeRelationship();
    // const delegateExist = checkDelegateExist();
    // if(!isSenderValidSigner && signerExist && signerSafeRelationExist) {
    //   // signer isn't a signer anymore
    //   removeSafeSignerRelationship();
    //   log.info("Sender isn't a valid signer anymore. Removing Signer's relationship with Safe", []);
    // }
    // if(isSenderValidSigner) {
    //   if(!signerExist) {
    //     composeSigner();
    //   }
    //   if(!signerSafeRelationExist) {
    //     // new signer to the safe
    //     composeSafeSignerRelation();
    //   }
    //     return false;
    // } else if(!delegateExist) {
    // // if noeither signer nor delegate -> revert
    //   throw Error("Sender is neither signer nor delegate!");
    // } else {
    //   // delegate flow
    // }
  
    // // check if signature is valid
    // const isSignatureValid = validateSignature();
    // // check if transaction exists, if not, create transaction
    // const transactionExists = await checkTransactionExists();
    // if(!transactionExists) {
    //   composeTransaction();
    // }
    //    else, add confirmation to transaction
    // add a confirmation if the transaction is created by a signer
    // if not signer, check if sender is a delegate
    // do not add confirmations
    return true
  }