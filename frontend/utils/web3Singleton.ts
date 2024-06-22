// web3Singleton.ts
import Web3 from 'web3';

class Web3Singleton {
    private static instance: Web3 | null = null;

    public static initialize(provider: any): Web3 {
        if (!Web3Singleton.instance) {
            Web3Singleton.instance = new Web3(provider || "http://localhost:8545");
        }
        return Web3Singleton.instance;
    }

    public static getInstance(): Web3 {
        if (!Web3Singleton.instance) {
            throw new Error('Web3 instance not initialized. Call initialize() first.');
        }
        return Web3Singleton.instance;
    }
}

export default Web3Singleton;
