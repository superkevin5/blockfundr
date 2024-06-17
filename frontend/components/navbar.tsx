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
import {User} from "@nextui-org/user";
import {Logo} from "@/components/icons";
import React from "react";
import {isAuthChecked, login, logout} from "@/utils/auth";
import {useRouter} from "next/router";
import {useAuth} from "@/components/authContext";
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import {useDispatch, useSelector} from "react-redux"; // Import the wallet icon

const notify = (error: String) => toast.error(error);

export const Navbar = () => {
    const router = useRouter();
    const {user, setUser} = useAuth();
    const dispatch = useDispatch();
    // const web3 = useSelector(state => state.web3Reducer.connection)


    React.useEffect(() => {
        // checkAuth();
    }, []);

//     const loadAccount = async (web3, dispatch) => {
//         const account = await web3.eth.getAccounts();
//         const network = await web3.eth.net.getId();
//
// //   if (network !== Number(process.env.REACT_APP_NETWORK_ID)) {
// //     alert("Contract not deployed in this network !");
// //   }
//         dispatch(actions.walletAddressLoaded(account[0]));
//         localStorage.setItem("ADDRESS",account[0])
//         return account;
//     };

    const handleConenctWallet = async () => {

        //@ts-ignore
        if (window.ethereum) {
            //@ts-ignore
            await window.ethereum.request({method:"eth_requestAccounts"})
            // loadAccount(web3,dispatch)
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
        }
    }
    const checkAuth = async () => {
        try {
            // Check if the user is logged in
            const isLoggedUser = await isAuthChecked(); // Determine if the user is logged in
            if (isLoggedUser) {
                setUser(isLoggedUser)
                // router.push('/dashboard');
            } else {
                setUser({
                    name: "",
                    username: "",
                    userId: "",
                    role: ""
                })
                router.push('/login');
            }
        } catch (error) {
            setUser({
                name: "",
                username: "",
                userId: "",
                role: ""
            })
            console.error('Error checking authentication:', error);
            router.push('/login'); // Redirect to login page on error
        }
    };

    const handleLogout = async () => {
        try {
            const response = await logout()
            const data = await response.json();
            setUser({
                name: "",
                username: "",
                userId: "",
                role: ""
            })
            if (!response.ok) {
                throw new Error(data.message || 'Loginout failed');
            }
            router.push('/login');
        } catch (error: any) {
            notify(error.message)
        }
    };

    // @ts-ignore
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
                        {user.userId && (<User
                            name={user.name}
                            className={"avatar"}
                            description={user.name}
                            avatarProps={{
                                src: ""
                            }}
                        />)}
                        <Button
                            endContent={<FontAwesomeIcon icon={faWallet} />}
                            onClick={() => handleConenctWallet()}
                        >
                            Connect Wallet
                        </Button>
                    </div>
                </div>
            </div>
        </nav>

)

};
