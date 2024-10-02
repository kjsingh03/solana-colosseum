"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setAlert } from '@/store/slices';

function Alert(){
    const dispatch = useDispatch();
    const alert = useSelector((state: RootState) => state.main.alert);

    if (!alert.message) return null;

    return (
        <div className={`fixed w-full alert-${alert.type} z-50`}>
            <div className={`w-[50%] mx-auto flex items-center justify-between px-4 py-1 text-white border-2 rounded-xl ${alert.type==='success'?'border-green-600':'border-red-600'} bg-[#062832] mt-4`}>
                <p>{alert.message}</p>
                <button onClick={() => dispatch(setAlert({ message: '', type: 'error' }))}>X</button>
            </div>
        </div>
    );
};

export default Alert;
