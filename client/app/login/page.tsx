"use client";
import { setAlert, setMnemonic } from '@/store/slices';
import {     updateUser } from '@/store/userSlice';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useDispatch } from 'react-redux';

function page() {

    const dispatch = useDispatch();
    const router = useRouter();

    const googleLogin = async (res: any) => {
        const { email, picture, given_name } = res

        try {

            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google`, { email: email, imageUrl: picture, name: given_name });

            if (response.data.success) {
                console.log(response.data)
                localStorage.setItem("credentials", JSON.stringify(response.data.user))

                dispatch(updateUser(response.data.user))
                dispatch(setAlert({ message: response.data.message, type: 'success' }))

                if(response.data.mnemonic !== undefined)
                    dispatch(setMnemonic(response.data.mnemonic))
                
                setTimeout(() => router.push("/"), 800)
            }
            else {
                console.log(response.data.message)
            }
        } catch (e: any) {
            dispatch(setAlert({ message: 'Failed to Login', type: 'error' }))
            console.log(e)
        } finally {
            setTimeout(() => dispatch(setAlert({ message: '', type: 'error' })), 1200)
        }
    }

    return (
        <div>
            <div className='flex flex-col items-center py-16 gap-5 overflow-y-auto h-screen '>

                <h1 className='text-2xl font-bold'>login</h1>

                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
                    <GoogleLogin
                        onSuccess={res => googleLogin(jwtDecode(res.credential as any))}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                </GoogleOAuthProvider>

            </div>
        </div>
    )
}

export default page
