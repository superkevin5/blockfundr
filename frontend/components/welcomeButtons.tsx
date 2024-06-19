import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faVideo } from '@fortawesome/free-solid-svg-icons';
import {userLoaded, walletAddressLoaded} from "@/redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {isAuthChecked, login, saveOrFetchUser} from "@/utils/requestHandlers";
import {useApolloClient} from "@apollo/client"; // Import required icons

const WelcomeButtons = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    //@ts-ignore
    const account = useSelector((state) => state.web3.account);
    const client = useApolloClient();

    const handleConnectWallet = async () => {
        //@ts-ignore
        if (window.ethereum) {
            try {
                //@ts-ignore
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                if (accounts.length > 0) {
                    const account = accounts[0];
                    console.log(`Connected account: ${account}`);
                    // setAccount(account);
                    dispatch(walletAddressLoaded(account));
                    const user = await login(account)

                    if(!user.ok) {
                        throw Error('Wrong user')
                    }
                    const isLoggedUser = await isAuthChecked(); // Determine if the user is logged in

                    if (isLoggedUser) {
                        dispatch(userLoaded(isLoggedUser));
                    } else {
                        dispatch(userLoaded(null));
                        console.error("Error checking wallet connection:");
                    }
                    toast.success(`Wallet connected: ${account}`);
                } else {
                    console.error("No accounts found.");
                    toast.error("No accounts found.");
                }
            } catch (error) {
                console.error("Error connecting to wallet:", error);
                toast.error("Error connecting to wallet");
            }
        } else {
            window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
        }
    };

    const handleButtonClick = async (path: string) => {
        if (account) {
            router.push(path);
        } else {
            await handleConnectWallet();
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
