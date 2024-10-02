"use client"
import { Mnemonic } from "@/components";
import { RootState } from "@/store/store";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Home() {

  const mnemonic = useSelector((state: RootState) => state.main.mnemonic)

  return (
    <>
      {
        mnemonic &&
        <Mnemonic />
      }
      <div className="flex flex-col gap-4 py-20">
        <p>Home</p>
      </div>
    </>
  );
}
