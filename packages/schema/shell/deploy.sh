#!/bin/bash

# Default value for ceramicNodeUrl
LOCAL_HOST_CERAMIC_NODE_URL="http://localhost:7007"
ceramicNodeUrl=$LOCAL_HOST_CERAMIC_NODE_URL

# Function to show usage and exit
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --environment [dev|staging|prod]  (Required) Set the deployment environment."
    echo "                                     Options:"
    echo "                                     dev - Development environment."
    echo "                                     staging - Staging environment."
    echo "                                     prod - Production environment."
    echo "  --private-key [value]              (Required) Set the private key for authentication."
    echo "  --ceramic-url [value]              (Optional for dev, Required for others) Set the Ceramic node URL."
    echo "                                     Default: '$LOCAL_HOST_CERAMIC_NODE_URL'"
    echo "                                     Cannot be '$LOCAL_HOST_CERAMIC_NODE_URL' for non-dev environments."
    echo "  --help, -h                         Display this help message and exit."
    echo ""
    echo "Example:"
    echo "  $0 --environment dev --private-key abc123"
    echo "  $0 --environment prod --private-key abc123 --ceramic-url http://example.com"
    exit 1
}

# Check for --help or -h flag as the first argument
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    usage
fi

# Function to validate environment value and exit on error
validate_environment() {
    case $1 in
        dev|staging|prod) return 0 ;;
        *) 
           echo "Invalid environment value: $1"
           exit 1
           ;;
    esac
}

# Function to validate ceramicNodeUrl for non-dev environments
validate_ceramicNodeUrl() {
    if [ "$environment" != "dev" ] && { [ -z "$ceramicNodeUrl" ] || [ "$ceramicNodeUrl" == "$LOCAL_HOST_CERAMIC_NODE_URL" ]; }; then
        echo "Error: --ceramic-url is required and cannot be '$LOCAL_HOST_CERAMIC_NODE_URL' for non-dev environments."
        exit 1
    fi
}

# Parse arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --environment) 
            validate_environment "$2"
            environment="$2"
            shift 
            ;;
        --ceramic-url) ceramicNodeUrl="$2"; shift ;;
        --private-key) privateKey="$2"; shift ;;
        *) 
           echo "Unknown parameter passed: $1"
           usage
           ;;
    esac
    shift
done

# Check for mandatory arguments and exit on error
if [ -z "$environment" ] || [ -z "$privateKey" ]; then
    echo "Error: environment and private key are required."
    usage
fi

# Validate ceramicNodeUrl based on environment
validate_ceramicNodeUrl

# Inform the user about the action the script will take
echo "Deploying model to ceramic node..."
echo "Environment: $environment"
echo "Ceramic URL: $ceramicNodeUrl"
echo "Private Key: $privateKey"

# Set the parameters as environment variables
export ENVIRONMENT=$environment
export CERAMIC_NODE_URL=$ceramicNodeUrl
export PRIVATE_KEY=$privateKey

# Run the Node.js script
yarn create:composite

# Share definitions
yarn share:definitions