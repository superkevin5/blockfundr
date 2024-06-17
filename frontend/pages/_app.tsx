import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { fontSans, fontMono } from "@/config/fonts";
import {useRouter} from 'next/router';
import "@/styles/globals.css";

import { ApolloProvider } from '@apollo/client';
import {useApollo} from "@/lib/apolloClient";
import 'react-confirm-alert/src/react-confirm-alert.css';
import {AuthProvider} from "@/components/authContext";
import store from "@/redux/store";
import {Provider} from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
	const apolloClient = useApollo(pageProps.initialApolloState, router);

	return (
		<NextUIProvider navigate={router.push}>
			<ApolloProvider client={apolloClient}>
				<Provider store={store}>
				<NextThemesProvider>
				<AuthProvider>
					<Component {...pageProps} />
				</AuthProvider>
			</NextThemesProvider>
				</Provider>
			</ApolloProvider>
		</NextUIProvider>
	);
}

export const fonts = {
	sans: fontSans.style.fontFamily,
	mono: fontMono.style.fontFamily,
};
