import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faVideo } from '@fortawesome/free-solid-svg-icons';
import {walletAddressLoaded} from "@/redux/actions";
import {useDispatch, useSelector} from "react-redux"; // Import required icons

const WelcomeButtons = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    //@ts-ignore
    const account = useSelector((state) => state.web3.account);

    const handleConnectWallet = async () => {
        //@ts-ignore
        if (window.ethereum) {
            try {
                //@ts-ignore
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

                dispatch(walletAddressLoaded(accounts[0]));
                localStorage.setItem("ADDRESS", accounts[0]);
                toast.success(`Wallet connected: ${accounts[0]}`);
            } catch (error) {
                console.error('Error connecting to wallet:', error);
                toast.error('Error connecting to wallet');
            }
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    };

    const handleButtonClick = (path: string) => {
        if (account) {
            router.push(path);
        } else {
            handleConnectWallet();
            router.push(path);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {/*<ToastContainer />*/}
            <h1 className="mb-12 text-4xl font-bold text-gray-800">Welcome to Blockfundr</h1>
            <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-8">
                <button
                    onClick={() => handleButtonClick('/fundraiser')}
                    className="flex items-center justify-center px-12 py-6 text-2xl font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transform transition-transform duration-300 hover:scale-105"
                >
                    <FontAwesomeIcon icon={faVideo} className="mr-4" /> I am a Video Maker
                </button>
                <button
                    onClick={() => handleButtonClick('/contributor')}
                    className="flex items-center justify-center px-12 py-6 text-2xl font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transform transition-transform duration-300 hover:scale-105"
                >
                    <FontAwesomeIcon icon={faWallet} className="mr-4" /> I am a Contributor
                </button>
            </div>
        </div>
    );
};

export default WelcomeButtons;
