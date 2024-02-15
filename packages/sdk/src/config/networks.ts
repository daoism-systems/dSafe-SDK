const NETWORKS = {
  MAINNET: 'mainnet',
  SEPOLIA: 'sepolia',
  OP: 'optimism',
}

export const CAIP = {
  [NETWORKS.MAINNET]: 'eip155:1',
  [NETWORKS.SEPOLIA]: 'eip155:11155111',
  [NETWORKS.OP]: 'eip155:10',
}

export default NETWORKS
