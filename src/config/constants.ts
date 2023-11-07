import { type SAFE_API_NETWORK } from '../types/SAFE_API_NETWORK.types'

// Safe Transaction API endpoint
export const API_ENDPOINT = (network: string): string =>
  `https://safe-transaction-${API_NETWORKS[network as keyof SAFE_API_NETWORK]}.safe.global/api`

export const API_NETWORKS: SAFE_API_NETWORK = {
  mainnet: 'mainnet',
  goerli: 'goerli',
  optimism: 'optimism',
}

export const STATUS_CODE_200 = 200

export const STATUS_CODE_400 = 400
