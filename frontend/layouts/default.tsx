import { Navbar } from "@/components/navbar";
import { Head } from "./head";
import 'react-toastify/dist/ReactToastify.css';
import {useDispatch} from "react-redux";

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const dispatch = useDispatch()


	return (
		<div className="relative flex flex-col h-screen">
			<Head />
			<Navbar />
			<main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
				{children}
			</main>
			<footer className="w-full flex items-center justify-center py-3">
				{/*<Link*/}
				{/*	isExternal*/}
				{/*	className="flex items-center gap-1 text-current"*/}
				{/*	href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"*/}
				{/*	title="nextui.org homepage"*/}
				{/*>*/}
				{/*	<span className="text-default-600">Powered by</span>*/}
				{/*	<p className="text-primary">NextUI</p>*/}
				{/*</Link>*/}
			</footer>
		</div>
	);
}
