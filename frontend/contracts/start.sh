#!/bin/bash

# Start the Hardhat node in the background
npx hardhat node &
HARDHAT_NODE_PID=$!

# Wait for the Hardhat node to start
sleep 5

# Deploy the contracts to the local Hardhat network
npx hardhat run scripts/deploy.js --network localhost

# Capture the exit status of the deploy command
DEPLOY_EXIT_STATUS=$?

if [ $DEPLOY_EXIT_STATUS -ne 0 ]; then
    echo "Deployment failed with exit status $DEPLOY_EXIT_STATUS"
    # Stop the Hardhat node if deployment failed
    kill $HARDHAT_NODE_PID
    exit $DEPLOY_EXIT_STATUS
else
    echo "Deployment succeeded"
    # Keep the Hardhat node running in the foreground
    fg %1
fi
