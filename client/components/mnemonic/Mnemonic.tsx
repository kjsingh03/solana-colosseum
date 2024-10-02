import { cross } from '@/assets'
import { setMnemonic } from '@/store/slices'
import { RootState } from '@/store/store'
import Image from 'next/image'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function Mnemonic() {

    const mnemonic = useSelector((state: RootState) => state.main.mnemonic)

    const dispatch = useDispatch();

    return (
        <div className='w-screen h-screen bg-[#12121250] z-50 fixed flex flex-col items-center justify-center '>
            <div className="w-[60%] mx-auto bg-violet-600 flex flex-col gap-4 rounded-xl p-4">
                <div className="flex items-end justify-end">
                    <div className="w-5 h-5 overflow-hidden relative cursor-pointer" onClick={()=>dispatch(setMnemonic(''))}>
                        <Image src={cross} className='text-white' alt="cross" />
                    </div>
                </div>
                <p>Remember your mnemonics to recover your walletAddress</p>
                <p className='mnemonic'>{mnemonic || ''}</p>
                <div className="w-full text-center">
                <button className='w-max px-3 py-1 rounded-xl border border-transparent hover:border-white active:border-violet-800' onClick={() => navigator.clipboard.writeText(document.querySelector('.mnemonic')!.textContent ?? '')}>Tap to copy</button>
                </div>
            </div>
        </div>
    )
}
