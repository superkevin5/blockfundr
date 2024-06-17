import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import { Head } from "./head";
import 'react-toastify/dist/ReactToastify.css';

export default function DashBoardLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="flex flex-row w-full pt-16">
                {children}
            </main>
        </div>
    );
}
