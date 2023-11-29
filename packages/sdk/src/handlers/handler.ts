import { ComposeClient } from '@composedb/client'
import Logger from '../utils/Logger.utils.js'
import { checkSafeExists } from '../composedb/queries/querySafe.js'
import { CreateTransactionPayload } from '../types/CREATE_TRANSACTION_PAYLOAD.type.js'
import { checkSignerExists } from '../composedb/queries/querySigner.js'
import { composeSafe } from '../composedb/mutations/mutateSafe.js'
import axios from 'axios'
import { API_ENDPOINT } from '../config/constants.js'

const log = new Logger()

function handleDSafeLog(apiRoute: string): void {
  log.info('Using DSafe Registry and then SafeTransaction API. API Route:', [apiRoute])
}

export default async function handleDSafeRequest(composeClient: ComposeClient, 
  httpMethod: 'POST' | 'GET' | 'DELETE',
  apiRoute: string,
  payload?: unknown,
  network?: string,
): Promise<boolean> {
  switch (apiRoute) {
    case 'v1/data-decoder/':
      return handleDataDecoder(composeClient, payload, network)
    case 'v1/create-transaction/':
      return await handleCreateTransaction(composeClient, payload as CreateTransactionPayload, network)
    default:
      log.info('Using Safe Transaction API instead of DSafe Registry. API Route:', [apiRoute])
      return true;
  }
}

// api route
function handleDataDecoder(composeClient: ComposeClient, payload?: unknown, network?: string): boolean {
  handleDSafeLog("DATA Decoder")
  log.info('Handle Data Decoder', ["Data Decoer"])
  return true;
}

async function handleCreateTransaction(composeClient: ComposeClient, payload?: CreateTransactionPayload, network?: string): Promise<boolean> {
  // check if safe exists, if not, create safe
  if(payload === undefined) {
    throw Error("Payload cannot be undefined for Create Transaction");
  }
  if(payload.safeAddress === undefined) {
    throw Error("Please provide safe address using payload.safeAddress");
  }
  if(network === undefined) {
    throw Error("Please provide the network the safe is deployed on");
  }
  const safeExist = await checkSafeExists(payload.safeAddress,composeClient);
  console.log(safeExist);
  if(!safeExist) {
    console.log("Composing Safe");
    // get safe data from API Service
    const response = (await axios.get(`${API_ENDPOINT(network)}/v1/safes/${payload.safeAddress}`));
    // todo: add checks when response fails
    const data = response.data
    const input = {
      content: {
        network: "eip155:1",
        singleton: data.masterCopy,
        threshold: data.threshold,
        nonce:  data.nonce,// currently this nonce represent the total transaction executed on-chain
        safeAddress: payload.safeAddress,
        fallbackHandler: data.fallbackHandler,
        guard: data.guard,
        version: data.version,
        totalTransactions: data.nonce, // currently assuming users do not skip any nonce value
        nativeTokenBalance: "0", // todo: add function to fetch current native balance
        deployedBlockNumber: 10 // todo: add function to fetch the block number when the contract was deployed
      }
    }
    console.log("Creating new safe on ComposeDB...");
    await composeSafe(input, composeClient);
  }
  // for now, only focus on signer sending transaction
  const signerExist = await checkSignerExists(payload.sender, composeClient);
  if(!signerExist) {
    // composeSigner();
  }

  // if nonce already used, overwrite existing
  // note: this is same behaviour as Safe Transaction Service
  // composeTransaction(payload, composeClient);
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
  return false
}
