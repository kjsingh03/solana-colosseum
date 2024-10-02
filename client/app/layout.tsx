"use client";

import "./globals.css";
import { Alert, Navbar } from "@/components";
import store from "@/store/store";
import { Provider } from "react-redux";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  
  return (
    <Provider store={store}>
      <html lang="en">
        <title>Solana Hackathon</title>
        <body className={`antialiased`} >
          <Alert />
          <Navbar />
          {children}
        </body>
      </html>
    </Provider>
  );
}
