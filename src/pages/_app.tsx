import { Inter } from "@next/font/google";
import localFont from "@next/font/local";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Provider as RWBProvider } from "react-wrap-balancer";

import { api } from "../utils/api";

import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

const sfPro = localFont({
  src: "../styles/SF-Pro-Display-Medium.otf",
  variable: "--font-sf",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <RWBProvider>
        <main className={clsx(sfPro.variable, inter.variable)}>
          <Component {...pageProps} />
          <Toaster />
        </main>
      </RWBProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
