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
      <div className="w-[80%] mx-auto py-24">

        <div className="flex flex-col gap-4 bg-red-600">
          <h1 className="text-3xl">Upcoming Concerts</h1>
        </div>

      </div>
    </>
  );
}
