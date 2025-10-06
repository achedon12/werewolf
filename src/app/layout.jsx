import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header/Header";
import Footer from "@/components/common/footer/Footer";
import {ToastContainer} from "react-toastify";
import {Providers} from "@/app/AuthProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Online Werewolf - Jouez au Loup-Garou en ligne",
    description: "Plateforme en ligne pour jouer au jeu de société Loup-Garou avec vos amis.",
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Providers>
            <Header/>
            {children}
            <Footer/>
        </Providers>
        <ToastContainer/>
        </body>
        </html>
    );
}
