import { User } from '@/interface'
import { RootState } from '@/store/store'
import { updateUser } from '@/store/userSlice'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function Navbar() {

    const user = useSelector((state: RootState) => state.user.user);

    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem('credentials')) {
            dispatch(updateUser(JSON.parse(localStorage.getItem('credentials') as string)))
        }
    }, [])

    const logout = () => {
        localStorage.removeItem('credentials')
        dispatch(updateUser({ email: '', name: '', token: '', walletAddress: '', imageUrl: '' }))
    }

    return (
        <nav className='w-full bg-violet-950 fixed'>
            <div className="w-[80%] mx-auto flex justify-between items-center h-12">

                <ul className="flex items-center justify-center gap-8 ">
                    <li><Link href="/" >Home</Link></li>
                    {
                        !user.email ?
                            <li><Link href="/login" >Login</Link></li> :
                            <li onClick={logout}>Logout</li>
                    }
                </ul>

                <div className="flex items-center justify-center gap-8">
                    {
                        user.email &&
                        <>
                            <p>{user.name}</p>
                            <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                <Image src={user.imageUrl || ''} fill objectFit='cover' className='w-full h-full object-fill' alt="Thumbnail" />
                            </div>
                            <p>{user.walletAddress}</p>
                        </>
                    }
                </div>
            </div>
        </nav>
    )
}
