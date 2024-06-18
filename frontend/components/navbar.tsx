import {
    Button,
    Kbd,
    Link,
    Input,
    Navbar as NextUINavbar,
    NavbarContent,
    NavbarMenu,
    NavbarMenuToggle,
    NavbarBrand,
    NavbarItem,
    NavbarMenuItem,
} from "@nextui-org/react";
import {ToastContainer, toast} from 'react-toastify';
import NextLink from "next/link";
import {ThemeSwitch} from "@/components/theme-switch";
import {
    SearchIcon,
} from "@/components/icons";
import { faWallet, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import {User} from "@nextui-org/user";
import {Logo} from "@/components/icons";
import React, {useEffect, useState} from "react";
import {isAuthChecked, login, logout} from "@/utils/auth";
import {useRouter} from "next/router";
import {useAuth} from "@/components/authContext";
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useDispatch, useSelector} from "react-redux";
import {walletAddressLoaded} from "@/redux/actions"; // Import the wallet icon

const notify = (error: String) => toast.error(error);

export const Navbar = () => {
    const router = useRouter();
    const {user, setUser} = useAuth();
    const dispatch = useDispatch();
    // const web3 = useSelector(state => state.web3Reducer.connection)
    const [account, setAccount] = useState<string | null>(null);


    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const checkIfWalletIsConnected = async () => {
        //@ts-ignore
        if (window.ethereum) {
            try {
                //@ts-ignore
                const accounts = await window.ethereum.request({ method: "eth_accounts" });
                if (accounts.length > 0) {
                    const account = accounts[0];
                    console.log(`Already connected account: ${account}`);
                    setAccount(account);
                    dispatch(walletAddressLoaded(account));
                    localStorage.setItem("ADDRESS", account);
                }
            } catch (error) {
                console.error("Error checking wallet connection:", error);
            }
        }
    };


    const handleConnectWallet = async () => {
        //@ts-ignore
        if (window.ethereum) {
            try {
                //@ts-ignore
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                if (accounts.length > 0) {
                    const account = accounts[0];
                    console.log(`Connected account: ${account}`);
                    setAccount(account);
                    dispatch(walletAddressLoaded(account));
                    localStorage.setItem("ADDRESS", account);
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
    const handleDisconnectWallet = () => {
        setAccount(null);
        localStorage.removeItem("ADDRESS");
        dispatch(walletAddressLoaded(null));
        toast.info("Wallet disconnected");
    };



    // @ts-ignore
    return (
        <nav
            className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar"
                                aria-controls="logo-sidebar" type="button"
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                            <span className="sr-only"></span>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" fillRule="evenodd"
                                      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                            </svg>
                        </button>
                        <a href="/dashboard" className="flex ms-2 md:me-24">
                            {/*<img src="/logo.png" className="h-8 me-3"*/}
                            {/*     alt="FlowBite Logo"/>*/}
                            <span
                                className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Blockfundr</span>
                        </a>
                    </div>
                    <div className="flex items-center">
                        {account ? (
                            <div className="flex items-center space-x-4">
                                <span
                                    className="text-sm text-gray-500 dark:text-gray-400">{`Connected: ${account}`}</span>
                                <Button
                                    endContent={<FontAwesomeIcon icon={faSignOutAlt}/>}
                                    onClick={handleDisconnectWallet}
                                >
                                    Disconnect
                                </Button>
                            </div>
                        ) : (
                            <Button
                                endContent={<FontAwesomeIcon icon={faWallet}/>}
                                onClick={handleConnectWallet}
                            >
                                Connect Wallet
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </nav>

    )

};
