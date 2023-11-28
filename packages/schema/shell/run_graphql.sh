#!/bin/bash

# Initialize variables
ceramicNodeUrl=""
filePath=""
privateKey=""
portNumber=5005

# Function to display usage
usage() {
    echo "Usage: $0 --ceramic-url <url> --path <file_path> --private-key <key> [--port <port_number>]"
    exit 1
}

# Parse the command-line options
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --ceramic-url)
        ceramicNodeUrl="$2"
        shift # past argument
        shift # past value
        ;;
        --path)
        filePath="$2"
        shift # past argument
        shift # past value
        ;;
        --private-key)
        privateKey="$2"
        shift # past argument
        shift # past value
        ;;
        --port)
        portNumber="$2"
        shift # past argument
        shift # past value
        ;;
        *)    # unknown option
        usage
        ;;
    esac
done

# Check if mandatory parameters are provided
if [ -z "$ceramicNodeUrl" ] || [ -z "$filePath" ] || [ -z "$privateKey" ]; then
    echo "Error: Ceramic Node URL, File path, and Private key are required."
    usage
fi

# Print the received options
echo "Ceramic Node URL: $ceramicNodeUrl"
echo "File Path: $filePath"
echo "Private Key: $privateKey"
if [ -n "$portNumber" ]; then
    echo "Port Number: $portNumber"
else
    echo "Port Number: Not provided"
fi

export FILE_PATH=$filePath
export CERAMIC_NODE_URL=$ceramicNodeUrl
export PRIVATE_KEY=$privateKey
export PORT_NUMBER=$portNumber

yarn script:startGraphql