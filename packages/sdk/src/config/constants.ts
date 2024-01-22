import { type CeramicNetwork, type SAFE_API_NETWORK } from '../types/SAFE_API_NETWORK.types.js'

// Safe Transaction API endpoint
export const API_ENDPOINT = (network: string): string =>
  `https://safe-transaction-${API_NETWORKS[network as keyof SAFE_API_NETWORK]}.safe.global/api`

export const API_NETWORKS: SAFE_API_NETWORK = {
  mainnet: 'mainnet',
  goerli: 'goerli',
  optimism: 'optimism',
}

export const CERAMIC_NETWORKS: CeramicNetwork = {
  local: 'http://0.0.0.0:7007',
  testnet: '',
  mainnet: '',
}

export const STATUS_CODE_200 = 200

export const STATUS_CODE_201 = 201

export const STATUS_CODE_202 = 202

export const STATUS_CODE_400 = 400

export const ZERO_ADDRESS_REFUND_RECEIVER = '0x0000000000000000000000000000000000000000'

export const ZERO_ADDRESS_GAS_TOKEN = '0x0000000000000000000000000000000000000000'

export const EMPTY_TRANSACTION_DATA = '0x'
